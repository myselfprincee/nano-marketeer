import { NextRequest, NextResponse } from 'next/server'
import { generateTryOnImage } from '@/app/utils/imageapi'
import { auth } from '@/app/auth'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      folderId, 
      type, 
      pictureStyle, 
      uploadedImageUrl, 
      prompt, 
      previousAds 
    } = await request.json()

    if (!folderId || !type || !pictureStyle || !uploadedImageUrl || !prompt) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Verify folder belongs to user
    const folderResult = await pool.query(`
      SELECT * FROM ad_folders 
      WHERE id = $1 AND user_id = $2 AND is_active = true
    `, [folderId, session.user.id])

    if (folderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    const folder = folderResult.rows[0]

    // Enhance prompt with folder context and previous ads
    let enhancedPrompt = prompt
    if (previousAds && previousAds.length > 0) {
      enhancedPrompt += ` 

STYLE CONSISTENCY INSTRUCTIONS:
- Campaign: ${folder.name}
- Style: ${pictureStyle}
- Type: ${type}
- Previous ad context: ${previousAds[0].prompt.substring(0, 200)}...
- Maintain visual consistency with previous ads in this campaign
- Keep the same color palette and design aesthetic`
    }

    enhancedPrompt += `

TECHNICAL REQUIREMENTS:
- High quality, professional ${type.toLowerCase()}
- ${pictureStyle.toLowerCase()} visual style
- Marketing-focused composition
- Clear branding space
- Eye-catching and scroll-stopping design
- Optimized for digital advertising platforms`

    console.log('Generating ad with enhanced prompt:', enhancedPrompt)

    // Generate the ad using your existing image generation API
    const result = await generateTryOnImage({
      modelImageUrl: uploadedImageUrl, // Use uploaded image as base
      clothingImageUrl: uploadedImageUrl, // For ads, we use the same image
      userId: session.user.id,
      prompt: enhancedPrompt
    })

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to generate ad' 
      }, { status: 500 })
    }

    // Save the generated ad to database
    const generationSettings = {
      type,
      pictureStyle,
      originalPrompt: prompt,
      enhancedPrompt,
      folderContext: folder.name,
      previousAdsCount: previousAds?.length || 0
    }

    const savedAd = await pool.query(`
      INSERT INTO generated_ads (
        user_id, folder_id, type, picture_style, 
        uploaded_image_url, prompt, generated_image_url, generation_settings
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      session.user.id,
      folderId,
      type,
      pictureStyle,
      uploadedImageUrl,
      prompt,
      result.imageUrl,
      JSON.stringify(generationSettings)
    ])

    return NextResponse.json({
      success: true,
      ad: savedAd.rows[0],
      imageUrl: result.imageUrl
    })

  } catch (error) {
    console.error('Ad generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate ad' },
      { status: 500 }
    )
  }
}