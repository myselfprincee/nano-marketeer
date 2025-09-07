'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

interface TryOnResult {
  id: number
  model_image_url: string
  clothing_image_url: string
  result_image_url: string
  created_at: string
}

const TryOnHistory = () => {
  const { data: session } = useSession()
  const [results, setResults] = useState<TryOnResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      loadTryOnHistory()
    }
  }, [session])

  const loadTryOnHistory = async () => {
    try {
      const response = await fetch('/api/ai-tryon/history')
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      }
    } catch (error) {
      console.error('Error loading try-on history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Please sign in to view your try-on history</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Try-On Gallery</h1>
          <Link 
            href="/ai-tryon"
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
          >
            Create New Try-On
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Try-Ons Yet</h3>
            <p className="text-gray-500 mb-6">Start creating AI-powered try-on images!</p>
            <Link 
              href="/ai-tryon"
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
            >
              Create Your First Try-On
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((result) => (
              <div key={result.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-3 aspect-h-4">
                  <Image
                    src={result.result_image_url}
                    width={300}
                    height={400}
                    alt={`Try-on result ${result.id}`}
                    className="w-full h-80 object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex space-x-2">
                      <Image
                        src={result.model_image_url}
                        width={40}
                        height={40}
                        alt="Model used"
                        className="w-10 h-10 rounded object-cover border"
                      />
                      <Image
                        src={result.clothing_image_url}
                        width={40}
                        height={40}
                        alt="Clothing used"
                        className="w-10 h-10 rounded object-cover border"
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(result.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <a 
                      href={result.result_image_url} 
                      download={`ai-tryon-${result.id}.jpg`}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors text-center"
                    >
                      Download
                    </a>
                    <button 
                      onClick={() => navigator.share?.({ 
                        title: 'AI Try-On Result',
                        text: 'Check out my AI try-on result!',
                        url: result.result_image_url
                      })}
                      className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TryOnHistory