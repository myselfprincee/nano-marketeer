import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export interface CustomModel {
  id: number
  user_id: string
  image_url: string
  original_filename: string | null
  file_size: number | null
  mime_type: string | null
  uploaded_at: Date
  is_active: boolean
}

export async function saveCustomModel(
  userId: string,
  imageUrl: string,
  filename: string,
  fileSize: number,
  mimeType: string
): Promise<CustomModel> {
  try {
    const result = await pool.query(
      `INSERT INTO custom_models (user_id, image_url, original_filename, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, imageUrl, filename, fileSize, mimeType]
    )
    return result.rows[0]
  } catch (error) {
    console.error('Error saving custom model:', error)
    throw new Error('Failed to save custom model')
  }
}

export async function getUserCustomModels(userId: string): Promise<CustomModel[]> {
  try {
    const result = await pool.query(
      `SELECT * FROM custom_models 
       WHERE user_id = $1 AND is_active = true 
       ORDER BY uploaded_at DESC`,
      [userId]
    )
    return result.rows
  } catch (error) {
    console.error('Error fetching custom models:', error)
    throw new Error('Failed to fetch custom models')
  }
}

export async function deleteCustomModel(userId: string, modelId: number): Promise<boolean> {
  try {
    const result = await pool.query(
      `UPDATE custom_models SET is_active = false 
       WHERE id = $1 AND user_id = $2`,
      [modelId, userId]
    )
    return (result.rowCount ?? 0) > 0
  } catch (error) {
    console.error('Error deleting custom model:', error)
    throw new Error('Failed to delete custom model')
  }
}