import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/app/utils/r2config';

export interface TryOnRequest {
  modelImageUrl: string;
  clothingImageUrl: string;
  userId: string;
  prompt?: string;
}

export interface TryOnResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export const generateTryOnImage = async ({
  modelImageUrl,
  clothingImageUrl,
  userId,
  prompt = "Generate a realistic photo of the model wearing the clothing item. Maintain the model's pose and facial features while naturally fitting the clothing."
}: TryOnRequest): Promise<TryOnResult> => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
    };

    const model = 'gemini-2.5-flash-image-preview';

    // Fetch the images and convert to base64
    const [modelResponse, clothingResponse] = await Promise.all([
      fetch(modelImageUrl),
      fetch(clothingImageUrl)
    ]);

    const modelBuffer = await modelResponse.arrayBuffer();
    const clothingBuffer = await clothingResponse.arrayBuffer();

    const modelBase64 = Buffer.from(modelBuffer).toString('base64');
    const clothingBase64 = Buffer.from(clothingBuffer).toString('base64');

    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            text: `${prompt}

Instructions:
- Take the model from the first image
- Apply the clothing from the second image onto the model
- Keep the model's pose, facial features, and body proportions exactly the same
- Ensure the clothing fits naturally and realistically
- Maintain professional photo quality
- The result should look like a real fashion photograph`,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: modelBase64,
            },
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', 
              data: clothingBase64,
            },
          },
        ],
      },
    ];

    console.log('Generating AI try-on image...');
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Process the response
    for await (const chunk of response) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }

      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        const fileExtension = mime.getExtension(inlineData.mimeType || '') || 'jpg';
        const buffer = Buffer.from(inlineData.data || '', 'base64');

        // Upload to R2
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const fileName = `ai-tryon/results/${userId}/${timestamp}-${randomString}.${fileExtension}`;

        const uploadCommand = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: fileName,
          Body: buffer,
          ContentType: inlineData.mimeType || 'image/jpeg',
          ContentLength: buffer.length,
        });

        await r2.send(uploadCommand);
        const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

        console.log('AI try-on image generated and uploaded:', imageUrl);
        return { success: true, imageUrl };
      } else {
        console.log('AI response text:', chunk.text);
      }
    }

    return { success: false, error: 'No image generated' };

  } catch (error) {
    console.error('Error generating try-on image:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};