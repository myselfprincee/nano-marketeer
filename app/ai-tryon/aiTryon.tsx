// \NanoBanana Marketing Project\nano-marketer\app\ai-tryon\aiTryon.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { CustomModel } from '@/app/utils/modelMethods'
import ImageUploader from '@/app/utils/ImageUploader'
import Link from 'next/link'

type Category = 'Boys' | 'Girls' | 'Custom';
type SelectedModel = string | null;

interface ClothingItem {
  id: number
  user_id: string
  image_url: string
  original_filename: string | null
  file_size: number | null
  mime_type: string | null
  uploaded_at: Date
  is_active: boolean
}

interface TryOnResult {
  id: number
  imageUrl: string
  createdAt: string
  modelImageUrl: string
  clothingImageUrl: string
  prompt?: string
}

const AITRYON = () => {
  const { data: session } = useSession()
  const [selectedCategory, setSelectedCategory] = useState<Category>('Boys');
  const [selectedModel, setSelectedModel] = useState<SelectedModel>(null);
  const [customImages, setCustomImages] = useState<CustomModel[]>([]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<TryOnResult[]>([]);

  const boysList = [
    "https://res.cloudinary.com/princeecloud/image/upload/v1757263767/c88a1b5b2933dadb4850fa114171c1da_dt0ncm.jpg",
    "https://res.cloudinary.com/princeecloud/image/upload/v1757263767/ba32cf28dc691980b2c9f06695f7e01b_vqejxn.jpg",
    "https://res.cloudinary.com/princeecloud/image/upload/v1757263766/53b6241504b680bcab396b02a0b29918_jd8cwx.jpg"
  ]

  const girlsList = [
    "https://res.cloudinary.com/princeecloud/image/upload/v1757263794/portrait-fashionable-confident-business-woman_irtp3s.jpg",
    "https://res.cloudinary.com/princeecloud/image/upload/v1757263794/full-length-portrait-cheery-smiling-redhead-girl-with-victory-hand-gesture_bmogea.jpg",
    "https://res.cloudinary.com/princeecloud/image/upload/v1757263793/full-length-cheerful-woman-denim-clothes-posing-white-wall_dsi5kc.jpg",
    "https://res.cloudinary.com/princeecloud/image/upload/v1757263790/model_ulpwad.jpg",
    "https://res.cloudinary.com/princeecloud/image/upload/v1757263790/2b21de52f8be79891eb422e3cc69ccc7_dubgdm.jpg"
  ]

  // Load custom models on component mount
  useEffect(() => {
    if (session?.user && selectedCategory === 'Custom') {
      loadCustomModels()
    }
  }, [session, selectedCategory])

  // Load clothing items when step 2 is reached
  useEffect(() => {
    if (session?.user && step === 2) {
      loadClothingItems()
    }
  }, [session, step])

  const loadCustomModels = async () => {
    try {
      const response = await fetch('/api/ai-tryon/get')
      if (response.ok) {
        const data = await response.json()
        setCustomImages(data.models || [])
      }
    } catch (error) {
      console.error('Error loading custom models:', error)
    }
  }

  const loadClothingItems = async () => {
    try {
      const response = await fetch('/api/ai-tryon/clothing/get')
      if (response.ok) {
        const data = await response.json()
        setClothingItems(data.items || [])
      }
    } catch (error) {
      console.error('Error loading clothing items:', error)
    }
  }


  const generateTryOn = async () => {
    if (!selectedModel || !selectedClothing) {
      alert('Please select both a model and clothing item');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai-tryon/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelImageUrl: selectedModel,
          clothingImageUrl: selectedClothing,
          prompt: "Generate a high-quality, realistic photo of the model wearing the clothing item. Maintain the model's natural pose and facial features while ensuring the clothing fits perfectly and looks natural."
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedResults(prev => [data.result, ...prev]);
        setStep(3); // Move to results step
        alert('✅ AI Try-On generated successfully!');
      } else {
        alert(`❌ Generation failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('❌ Failed to generate try-on. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <p className="text-xl">Please sign in to use AI Try-On</p>
        <Link href={"/sign-in"}><button>Sign In</button></Link>
      </div>
    )
  }

  return (
    <div className='min-h-screen my-6 px-4'>
      {step === 1 && (
        <>
          <h1 className="text-3xl font-bold mb-4">Generate Model Photos W Your Clothes</h1>
          <div className='my-5'>
            <h2 className="text-2xl font-semibold mb-3">Choose From Our Models</h2>
            <div className='flex flex-wrap gap-2'>
              <button
                className='selection-button'
                data-selected={selectedCategory === "Boys"}
                onClick={() => setSelectedCategory('Boys')}
              >
                Boys
              </button>
              <button
                className='selection-button'
                data-selected={selectedCategory === "Girls"}
                onClick={() => setSelectedCategory('Girls')}
              >
                Girls
              </button>
              <button
                className='selection-button'
                data-selected={selectedCategory === "Custom"}
                onClick={() => setSelectedCategory('Custom')}
              >
                Upload Custom Model
              </button>
            </div>
          </div>

          {selectedCategory !== "Custom" ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {(selectedCategory === "Boys" ? boysList : girlsList).map((image, index) => (
                <div key={index} className="relative group flex-shrink-0">
                  <Image
                    draggable="false"
                    src={image}
                    width={200}
                    height={300}
                    alt={`${selectedCategory} model ${index + 1}`}
                    className="rounded-lg object-cover h-[300px] cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => {
                      setSelectedModel(image)
                    }}
                  />
                  {selectedModel === image && (
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
          ) : (
            <ImageUploader
              title={customImages.length === 0 ? "Upload your custom models" : "Add more models"}
              description="PNG, JPG, JPEG, WebP up to 10MB each"
              uploadEndpoint="/api/ai-tryon"
              images={customImages}
              onImagesChange={setCustomImages}
              onImageSelect={setSelectedModel}
              selectedImage={selectedModel}
              allowDelete={true}
              allowSelection={true}
            />
          )}

          {/* Continue button when model is selected */}
          {selectedModel && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 text-lg font-semibold"
              >
                Continue to Next Step →
              </button>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Back to Model Selection</span>
            </button>
            <h1 className="text-3xl font-bold">Step 2: Upload Your Clothes</h1>
          </div>

          {/* Show selected model */}
          {selectedModel && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-black">Selected Model:</h3>
              <Image
                src={selectedModel}
                width={150}
                height={200}
                alt="Selected model"
                className="rounded-lg object-cover"
              />
            </div>
          )}

          {/* Clothing Upload Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Upload Your Clothes</h2>
            <p className="text-gray-600">Upload images of the clothes you want to try on the selected model.</p>

            <ImageUploader
              title={clothingItems.length === 0 ? "Upload your clothing items" : "Add more clothing"}
              description="Clear photos of clothing items - PNG, JPG, JPEG, WebP up to 10MB each"
              uploadEndpoint="/api/ai-tryon/clothing/upload"
              images={clothingItems}
              onImagesChange={setClothingItems}
              onImageSelect={setSelectedClothing}
              selectedImage={selectedClothing}
              allowDelete={true}
              allowSelection={true}
              responseDataKey="item" // Specify this is for clothing items
            />
          </div>

          {/* Generate button when both model and clothing are selected */}
          {selectedModel && selectedClothing && (
            <div className="flex justify-center mt-8">
              <button
                onClick={generateTryOn}
                disabled={isGenerating}
                className={`px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all duration-200 text-lg font-semibold ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating AI Try-On...
                  </>
                ) : (
                  '🪄 Generate AI Try-On'
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Back to Generate More</span>
            </button>
            <h1 className="text-3xl font-bold">Step 3: AI Try-On Results</h1>
          </div>

          {/* Show inputs used */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-black">Model Used:</h3>
              <Image
                src={selectedModel!}
                width={200}
                height={300}
                alt="Model used"
                className="rounded-lg object-cover"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-black">Clothing Used:</h3>
              <Image
                src={selectedClothing!}
                width={200}
                height={300}
                alt="Clothing used"
                className="rounded-lg object-cover"
              />
            </div>
          </div>

          {/* Generated Results */}
          {generatedResults.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Generated Try-On Results</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedResults.map((result, index) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <Image
                      src={result.imageUrl}
                      width={300}
                      height={400}
                      alt={`AI Try-On Result ${index + 1}`}
                      className="w-full h-80 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm text-gray-600">
                        Generated: {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <a
                          href={result.imageUrl}
                          target='_blank'
                          rel="noopener noreferrer"
                          download={`ai-tryon-result-${result.id}.jpg`}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => navigator.share?.({
                            files: [new File([result.imageUrl], `ai-tryon-${result.id}.jpg`)]
                          })}
                          className="px-4 py-2 cursor-pointer bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate another button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 text-lg font-semibold"
            >
              🔄 Generate Another Try-On
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AITRYON