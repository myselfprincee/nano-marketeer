import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '@/app/utils/r2config'
import { saveCustomModel } from '@/app/utils/modelMethods'
import { auth } from '@/app/auth'

export async function POST(request: NextRequest) {
  try {
    // Get current user session
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `custom-models/${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`

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

    // Save to database
    const savedModel = await saveCustomModel(
      session.user.id,
      imageUrl,
      file.name,
      file.size,
      file.type
    )

    return NextResponse.json({
      success: true,
      model: savedModel,
      imageUrl: imageUrl
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}