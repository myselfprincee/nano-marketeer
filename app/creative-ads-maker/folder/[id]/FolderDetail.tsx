'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ImageUploader from '@/app/utils/ImageUploader'

interface AdFolder {
  id: number
  name: string
  description: string
  style_template: any
  created_at: string
}

interface GeneratedAd {
  id: number
  type: string
  picture_style: string
  uploaded_image_url: string
  prompt: string
  generated_image_url: string
  generation_settings: any
  created_at: string
}

const AD_TYPES = [
  'Product Showcase',
  'Lifestyle',
  'Social Media Post',
  'Banner Ad',
  'Story Ad',
  'Carousel',
  'Video Thumbnail',
  'Email Header'
]

const PICTURE_STYLES = [
  'Realistic',
  'Cartoon/Illustration',
  'Minimalist',
  'Vintage/Retro',
  'Modern/Clean',
  'Artistic/Creative',
  'Professional/Corporate',
  'Fun/Playful'
]

const FolderDetail = () => {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const folderId = params?.id as string

  const [folder, setFolder] = useState<AdFolder | null>(null)
  const [ads, setAds] = useState<GeneratedAd[]>([])
  const [uploadedImages, setUploadedImages] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Form states
  const [selectedType, setSelectedType] = useState(AD_TYPES[0])
  const [selectedStyle, setSelectedStyle] = useState(PICTURE_STYLES[0])
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user && folderId) {
      loadFolderData()
      loadFolderAds()
    }
  }, [session, folderId])

  useEffect(() => {
    // Auto-generate smart prompt based on previous ads and folder context
    generateSmartPrompt()
  }, [selectedType, selectedStyle, ads, folder])

  const loadFolderData = async () => {
    try {
      const response = await fetch(`/api/ads/folders/${folderId}`)
      if (response.ok) {
        const data = await response.json()
        setFolder(data.folder)
      } else if (response.status === 404) {
        router.push('/creative-ads-maker')
      }
    } catch (error) {
      console.error('Error loading folder:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFolderAds = async () => {
    try {
      const response = await fetch(`/api/ads/folders/${folderId}/ads`)
      if (response.ok) {
        const data = await response.json()
        console.log("this is loadFolderAds data ",data)
        setAds(data.ads || [])
      }
    } catch (error) {
      console.error('Error loading ads:', error)
    }
  }

  const generateSmartPrompt = () => {
    if (!folder || ads.length === 0) return

    // Analyze previous ads in this folder to maintain consistency
    const prevAds = ads.filter(ad => ad.type === selectedType && ad.picture_style === selectedStyle)

    if (prevAds.length > 0) {
      // Extract common themes and styles from previous ads
      const recentAd = prevAds[0]
      const basePrompt = recentAd.prompt

      // Create a smart prompt based on previous patterns
      const smartPrompt = `Create a ${selectedType.toLowerCase()} ad in ${selectedStyle.toLowerCase()} style for ${folder.name}. ${basePrompt.includes('brand') ? 'Maintain consistent brand aesthetics' : 'Follow the established visual theme'}. Focus on [describe your product/service here].`

      setPrompt(smartPrompt)
    } else {
      // Generate a basic prompt for new type/style combinations
      const basicPrompt = `Create a ${selectedType.toLowerCase()} advertisement in ${selectedStyle.toLowerCase()} style for ${folder.name} campaign. Make it eye-catching and professional. [Describe your specific product or message here].`
      setPrompt(basicPrompt)
    }
  }

  const generateAd = async () => {
    if (!selectedImage || !prompt.trim()) {
      alert('Please select an image and enter a prompt')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/ads/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderId: parseInt(folderId),
          type: selectedType,
          pictureStyle: selectedStyle,
          uploadedImageUrl: selectedImage,
          prompt: prompt,
          previousAds: ads.slice(0, 3) // Send last 3 ads for context
        })
      })

      const data = await response.json()

      if (data.success) {
        loadFolderAds() // Reload to show new ad
        alert('✅ Ad generated successfully!')
      } else {
        alert(`❌ Generation failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert('❌ Failed to generate ad')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Please sign in to access this folder</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!folder) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Folder Not Found</h1>
          <Link href="/creative-ads-maker" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Back to Folders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/creative-ads-maker"
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Folders
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{folder.name}</h1>
              {folder.description && (
                <p className="text-gray-600 mt-1">{folder.description}</p>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {ads.length} ads created
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ad Creation Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className=" rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-6 header-animation">Create New Ad</h2>

              {/* Ad Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {AD_TYPES.map(type => (
                    <option className='text-black' key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Picture Style Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Picture Style
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PICTURE_STYLES.map(style => (
                    <option className='text-black' key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <ImageUploader
                  title="Upload Product Image"
                  description="Upload the main image for your ad"
                  uploadEndpoint="/api/ads/upload"
                  images={uploadedImages}
                  onImagesChange={setUploadedImages}
                  onImageSelect={setSelectedImage}
                  selectedImage={selectedImage}
                  allowDelete={true}
                  allowSelection={true}
                  responseDataKey="image"
                />
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe what you want the ad to look like..."
                />
                {ads.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Prompt auto-generated based on your previous ads in this folder
                  </p>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={generateAd}
                disabled={isGenerating || !selectedImage || !prompt.trim()}
                className={`w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 ${(isGenerating || !selectedImage || !prompt.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Ad...
                  </>
                ) : (
                  '🎨 Generate Ad'
                )}
              </button>
            </div>
          </div>

          {/* Generated Ads Grid */}
          <div className="lg:col-span-2">
            <div className=" rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-6 header-animation">Generated Ads ({ads.length})</h2>

              {ads.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-gray-500">No ads created yet. Generate your first ad!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ads.map((ad) => (
                    <div key={ad.id} className="rounded-lg overflow-hidden border">
                      {ad.generated_image_url && (
                        <Image
                          src={ad.generated_image_url}
                          width={400}
                          height={300}
                          alt={`Generated ad ${ad.id}`}
                          className="w-full h-64 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {ad.type}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            {ad.picture_style}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{ad.prompt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(ad.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <a
                            target='_blank'
                              href={ad.generated_image_url}
                              download={`ad-${ad.id}.jpg`}
                              className="px-3 py-1 items-center justify-center flex bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                            >
                              Download
                            </a>
                            <button
                              onClick={() => navigator.share?.({
                                title: 'Generated Ad',
                                text: ad.prompt,
                                url: ad.generated_image_url
                              })}
                              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                            >
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FolderDetail