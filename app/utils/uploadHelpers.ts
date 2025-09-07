export interface UploadProgress {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error' | 'retrying'
  progress: number
  error?: string
  attempts: number
  result?: any
}

export interface UploadOptions {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  concurrency: number
}

export const DEFAULT_UPLOAD_OPTIONS: UploadOptions = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  concurrency: 3 // Upload 3 files at once
}

export function calculateBackoffDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1)
  const jitteredDelay = exponentialDelay * (0.5 + Math.random() * 0.5) // Add jitter
  return Math.min(jitteredDelay, maxDelay)
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function uploadWithRetry(
  file: File,
  onProgress: (progress: UploadProgress) => void,
  options: UploadOptions = DEFAULT_UPLOAD_OPTIONS
): Promise<any> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      // Update progress - retrying
      if (attempt > 1) {
        onProgress({
          file,
          status: 'retrying',
          progress: 0,
          attempts: attempt,
          error: lastError?.message
        })
        
        // Wait with exponential backoff
        const delay = calculateBackoffDelay(attempt - 1, options.baseDelay, options.maxDelay)
        await sleep(delay)
      }

      // Update progress - uploading
      onProgress({
        file,
        status: 'uploading',
        progress: 0,
        attempts: attempt
      })

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/ai-tryon/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      // Update progress - success
      onProgress({
        file,
        status: 'success',
        progress: 100,
        attempts: attempt,
        result
      })

      return result

    } catch (error) {
      lastError = error as Error
      console.error(`Upload attempt ${attempt} failed for ${file.name}:`, error)

      // Update progress - error (but might retry)
      onProgress({
        file,
        status: attempt < options.maxRetries ? 'error' : 'error',
        progress: 0,
        attempts: attempt,
        error: lastError.message
      })

      // If this was the last attempt, don't retry
      if (attempt === options.maxRetries) {
        throw lastError
      }
    }
  }

  throw lastError || new Error('Upload failed after all retries')
}

export async function uploadMultipleFiles(
  files: File[],
  onProgress: (progresses: Map<string, UploadProgress>) => void,
  options: UploadOptions = DEFAULT_UPLOAD_OPTIONS
): Promise<{ successful: any[], failed: Array<{ file: File, error: string }> }> {
  const progresses = new Map<string, UploadProgress>()
  const successful: any[] = []
  const failed: Array<{ file: File, error: string }> = []

  // Initialize progress for all files
  files.forEach(file => {
    progresses.set(file.name, {
      file,
      status: 'pending',
      progress: 0,
      attempts: 0
    })
  })
  onProgress(progresses)

  // Create upload queue with concurrency control
  const uploadQueue = [...files]
  const activeUploads = new Set<Promise<void>>()

  while (uploadQueue.length > 0 || activeUploads.size > 0) {
    // Start new uploads up to concurrency limit
    while (uploadQueue.length > 0 && activeUploads.size < options.concurrency) {
      const file = uploadQueue.shift()!
      
      const uploadPromise = uploadWithRetry(
        file,
        (progress) => {
          progresses.set(file.name, progress)
          onProgress(progresses)
        },
        options
      ).then(
        (result) => {
          successful.push(result)
        },
        (error) => {
          failed.push({ file, error: error.message })
        }
      ).finally(() => {
        activeUploads.delete(uploadPromise)
      })

      activeUploads.add(uploadPromise)
    }

    // Wait for at least one upload to complete
    if (activeUploads.size > 0) {
      await Promise.race(activeUploads)
    }
  }

  return { successful, failed }
}