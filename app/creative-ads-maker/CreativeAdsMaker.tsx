'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

interface AdFolder {
  id: number
  name: string
  description: string
  style_template: any
  created_at: string
  ad_count: number
}

interface GeneratedAd {
  id: number
  folder_id: number
  type: string
  picture_style: string
  uploaded_image_url: string
  prompt: string
  generated_image_url: string
  created_at: string
}

const CreativeAdsMaker = () => {
  const { data: session } = useSession()
  const [folders, setFolders] = useState<AdFolder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<AdFolder | null>(null)
  const [recentAds, setRecentAds] = useState<GeneratedAd[]>([])
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderDescription, setNewFolderDescription] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      loadFolders()
      loadRecentAds()
    }
  }, [session])

  const loadFolders = async () => {
    try {
      const response = await fetch('/api/ads/folders')
      if (response.ok) {
        const data = await response.json()
        setFolders(data.folders || [])
      }
    } catch (error) {
      console.error('Error loading folders:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentAds = async () => {
    try {
      const response = await fetch('/api/ads/recent')
      if (response.ok) {
        const data = await response.json()
        setRecentAds(data.ads || [])
      }
    } catch (error) {
      console.error('Error loading recent ads:', error)
    }
  }

  const createFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      const response = await fetch('/api/ads/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName,
          description: newFolderDescription
        })
      })

      if (response.ok) {
        setNewFolderName('')
        setNewFolderDescription('')
        setIsCreatingFolder(false)
        loadFolders()
        alert('✅ Folder created successfully!')
      } else {
        alert('❌ Failed to create folder')
      }
    } catch (error) {
      console.error('Error creating folder:', error)
      alert('❌ Failed to create folder')
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to create ads</p>
          <Link href="/" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Go Home
          </Link>
        </div>
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

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creative Ads Maker</h1>
            <p className="text-gray-600 mt-2">Create stunning ads with AI-powered design</p>
          </div>
          <button
            onClick={() => setIsCreatingFolder(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            + New Campaign Folder
          </button>
        </div>

        {/* Create Folder Modal */}
        {isCreatingFolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Create New Campaign Folder</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Folder Name *
                  </label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Summer Collection 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newFolderDescription}
                    onChange={(e) => setNewFolderDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe your campaign style and goals..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={createFolder}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Folder
                </button>
                <button
                  onClick={() => {
                    setIsCreatingFolder(false)
                    setNewFolderName('')
                    setNewFolderDescription('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Folders Grid */}
        {folders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Campaign Folders Yet</h3>
            <p className="text-gray-500 mb-6">Create your first folder to start organizing your ad campaigns!</p>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Create Your First Folder
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {folders.map((folder) => (
                <Link
                  key={folder.id}
                  href={`/creative-ads-maker/folder/${folder.id}`}
                  className="group"
                >
                  <div className=" rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group-hover:border-blue-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500">{folder.ad_count} ads</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {folder.name}
                    </h3>

                    {folder.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {folder.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created {new Date(folder.created_at).toLocaleDateString()}</span>
                      <svg className="w-4 h-4 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Ads Section */}
            {recentAds.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Ads</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentAds.slice(0, 8).map((ad) => (
                    <div key={ad.id} className=" rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                      {ad.generated_image_url && (
                        <Image
                          src={ad.generated_image_url}
                          width={300}
                          height={200}
                          alt={`Generated ad ${ad.id}`}
                          className="w-full h-48 object-cover"
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
                        <p className="text-sm text-gray-600 line-clamp-2">{ad.prompt}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(ad.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CreativeAdsMaker