import { NextRequest, NextResponse } from 'next/server';
import { generateTryOnImage } from '@/app/utils/imageapi';
import { auth } from '@/app/auth';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Save the generated result to database
async function saveTryOnResult(
    userId: string,
    modelImageUrl: string,
    clothingImageUrl: string,
    resultImageUrl: string
) {
    try {
        const result = await pool.query(
            `INSERT INTO tryon_results (user_id, model_image_url, clothing_image_url, result_image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [userId, modelImageUrl, clothingImageUrl, resultImageUrl]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error saving try-on result:', error);
        throw new Error('Failed to save try-on result');
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({
                error: 'Unauthorized - Please sign in'
            }, { status: 401 });
        }

        const body = await request.json();
        const { modelImageUrl, clothingImageUrl, prompt } = body;

        if (!modelImageUrl || !clothingImageUrl) {
            return NextResponse.json({
                error: 'Model image and clothing image URLs are required'
            }, { status: 400 });
        }

        console.log('Generating try-on for user:', session.user.id);
        console.log('Model URL:', modelImageUrl);
        console.log('Clothing URL:', clothingImageUrl);

        // Generate the try-on image
        const result = await generateTryOnImage({
            modelImageUrl,
            clothingImageUrl,
            userId: session.user.id,
            prompt
        });

        if (!result.success) {
            return NextResponse.json({
                error: result.error || 'Failed to generate try-on image'
            }, { status: 500 });
        }

        // Save the result to database
        const savedResult = await saveTryOnResult(
            session.user.id,
            modelImageUrl,
            clothingImageUrl,
            result.imageUrl!
        );

        return NextResponse.json({
            success: true,
            result: {
                id: savedResult.id,
                imageUrl: result.imageUrl,
                modelImageUrl,
                clothingImageUrl,
                createdAt: savedResult.created_at
            }
        });

    } catch (error) {
        console.error('Try-on generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate try-on image' },
            { status: 500 }
        );
    }
}