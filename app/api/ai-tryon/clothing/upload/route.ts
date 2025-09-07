import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '@/app/utils/r2config'
import { saveClothingItem } from '@/app/utils/clothingMethods'
import { auth } from '@/app/auth'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    // Get current user session
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to upload images' 
      }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ 
        error: 'No file provided' 
      }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }, { status: 400 })
    }

    // Generate unique filename for clothing items
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const fileName = `ai-tryon/clothing/${session.user.id}/${timestamp}-${randomString}.${fileExtension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ContentLength: file.size,
    })

    await r2.send(uploadCommand)

    // Generate public URL
    const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`

    // Save to clothing_items database table
    const savedItem = await saveClothingItem(
      session.user.id,
      imageUrl,
      file.name,
      file.size,
      file.type
    )

    return NextResponse.json({
      success: true,
      item: savedItem, // Return 'item' for clothing
      imageUrl: imageUrl
    })

  } catch (error: any) {
    console.error('Clothing upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again later.' },
      { status: 500 }
    )
  }
}