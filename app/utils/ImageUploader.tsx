'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  uploadMultipleFiles,
  UploadProgress,
  DEFAULT_UPLOAD_OPTIONS
} from './uploadHelpers'

interface ImageUploaderProps {
  title: string
  description: string
  uploadEndpoint: string
  images: any[]
  onImagesChange: (images: any[]) => void
  onImageSelect?: (imageUrl: string) => void
  selectedImage?: string | null
  allowDelete?: boolean
  allowSelection?: boolean
  acceptedTypes?: string
  maxFileSize?: number
  showProgress?: boolean
  responseDataKey?: string // NEW: specify which key to extract from response
}

const ImageUploader = ({
  title,
  description,
  uploadEndpoint,
  images,
  onImagesChange,
  onImageSelect,
  selectedImage,
  allowDelete = true,
  allowSelection = true,
  acceptedTypes = "image/png, image/jpeg, image/jpg, image/webp",
  maxFileSize = 10,
  showProgress = true,
  responseDataKey = 'model' // NEW: default to 'model', but can be 'item' for clothing
}: ImageUploaderProps) => {
  const [uploadProgresses, setUploadProgresses] = useState<Map<string, UploadProgress>>(new Map())
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgresses(new Map())

    try {
      const filesArray = Array.from(files)
      const maxSizeBytes = maxFileSize * 1024 * 1024
      const allowedTypes = acceptedTypes.split(', ')

      // Debug logs
      filesArray.forEach(file => {
        console.log('File details:', {
          name: file.name,
          type: file.type,
          size: file.size,
          allowedTypes: allowedTypes
        });
      });

      // Validate files before uploading
      const invalidFiles = filesArray.filter(file => {
        console.log(`Checking file ${file.name}: type=${file.type}, allowed=${allowedTypes.includes(file.type)}`);
        if (file.size > maxSizeBytes) return true
        if (!allowedTypes.includes(file.type)) return true
        return false
      })

      if (invalidFiles.length > 0) {
        alert(`Some files are invalid:\n${invalidFiles.map(f => `- ${f.name}: ${f.size > maxSizeBytes ? 'Too large' : 'Invalid type'}`).join('\n')}`)
        return
      }

      // Create custom upload function for this specific endpoint
      const customUploadMultiple = async (
        files: File[],
        onProgress: (progresses: Map<string, UploadProgress>) => void
      ) => {
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

        // Upload files one by one
        for (const file of files) {
          try {
            // Update progress - uploading
            progresses.set(file.name, {
              file,
              status: 'uploading',
              progress: 0,
              attempts: 1
            })
            onProgress(progresses)

            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch(uploadEndpoint, {
              method: 'POST',
              body: formData,
            })

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}))
              throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
            }

            const result = await response.json()

            // Update progress - success
            progresses.set(file.name, {
              file,
              status: 'success',
              progress: 100,
              attempts: 1,
              result
            })
            onProgress(progresses)

            successful.push(result)

          } catch (error) {
            console.error(`Upload failed for ${file.name}:`, error)
            
            // Update progress - error
            progresses.set(file.name, {
              file,
              status: 'error',
              progress: 0,
              attempts: 1,
              error: (error as Error).message
            })
            onProgress(progresses)

            failed.push({ file, error: (error as Error).message })
          }
        }

        return { successful, failed }
      }

      // Upload with custom function
      const { successful, failed } = await customUploadMultiple(filesArray, setUploadProgresses)

      // Add successful uploads to the list - USE THE CORRECT KEY
      if (successful.length > 0) {
        const newImages = successful
          .filter(result => result.success)
          .map(result => result[responseDataKey]) // Use the specified key (model or item)
        
        onImagesChange([...images, ...newImages])
      }

      // Show results
      if (successful.length > 0 && failed.length === 0) {
        alert(`✅ Successfully uploaded ${successful.length} image(s)!`)
      } else if (successful.length > 0 && failed.length > 0) {
        alert(`⚠️ Uploaded ${successful.length} image(s) successfully.\n${failed.length} upload(s) failed:\n${failed.map(f => `- ${f.file.name}: ${f.error}`).join('\n')}`)
      } else {
        alert(`❌ All uploads failed:\n${failed.map(f => `- ${f.file.name}: ${f.error}`).join('\n')}`)
      }

    } catch (error) {
      console.error('Upload process error:', error)
      alert('Upload process failed. Please try again.')
    } finally {
      setIsUploading(false)
      event.target.value = ''
      setTimeout(() => setUploadProgresses(new Map()), 3000)
    }
  }

  const removeImage = async (imageId: number, index: number) => {
    try {
      const response = await fetch(`${uploadEndpoint}/delete?id=${imageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const newImages = images.filter((_, i) => i !== index)
        onImagesChange(newImages)
        
        // If the deleted image was selected, clear selection
        const deletedImage = images[index]
        if (selectedImage === deletedImage.image_url && onImageSelect) {
          onImageSelect('')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to delete image: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete image. Please try again.')
    }
  }

  // ... rest of the component stays the same (getStatusColor, getStatusIcon, render)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'uploading': return 'text-blue-600'
      case 'retrying': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'uploading': return '⏳'
      case 'retrying': return '🔄'
      default: return '⏸️'
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="text-gray-500 mb-4 text-xl">{title}</h3>
          <p className="text-gray-400 mb-4">{description}</p>
          <label className={`inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isUploading ? 'Uploading...' : 'Choose Files'}
            <input
              type='file'
              accept={acceptedTypes}
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {showProgress && uploadProgresses.size > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Upload Progress</h4>
          <div className="space-y-2">
            {Array.from(uploadProgresses.values()).map((progress, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-lg">{getStatusIcon(progress.status)}</span>
                  <span className="text-sm font-medium truncate max-w-48">{progress.file.name}</span>
                  <span className={`text-xs ${getStatusColor(progress.status)}`}>
                    {progress.status === 'retrying' ? `Retry ${progress.attempts}` : progress.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {progress.status === 'uploading' && (
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      ></div>
                    </div>
                  )}
                  {progress.error && (
                    <span className="text-xs text-red-500 max-w-32 truncate" title={progress.error}>
                      {progress.error}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className='flex flex-col mb-6'>
          <h3 className="text-xl font-semibold mb-4">Uploaded Images ({images.length})</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {images.map((item, index) => (
              <div key={item.id} className="relative group flex-shrink-0">
                <Image
                  src={item.image_url}
                  width={200}
                  height={300}
                  unoptimized
                  alt={`Uploaded image ${index + 1}`}
                  className={`rounded-lg object-cover h-[300px] transition-transform duration-200 ${
                    allowSelection ? 'cursor-pointer hover:scale-105' : ''
                  }`}
                  onClick={() => {
                    if (allowSelection && onImageSelect) {
                      onImageSelect(item.image_url)
                    }
                  }}
                />

                {/* Remove button */}
                {allowDelete && (
                  <button
                    onClick={() => removeImage(item.id, index)}
                    className="absolute top-2 cursor-pointer right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

                {/* Selection indicator */}
                {allowSelection && selectedImage === item.image_url && (
                  <div className="absolute inset-0 bg-orange-500 bg-opacity-30 rounded-lg flex items-center justify-center">
                    <div className="bg-white rounded-full p-2">
                      <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader