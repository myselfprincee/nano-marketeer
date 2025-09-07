import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export interface ClothingItem {
  id: number
  user_id: string
  image_url: string
  original_filename: string | null
  file_size: number | null
  mime_type: string | null
  uploaded_at: Date
  is_active: boolean
}

export async function saveClothingItem(
  userId: string,
  imageUrl: string,
  filename: string,
  fileSize: number,
  mimeType: string
): Promise<ClothingItem> {
  try {
    const result = await pool.query(
      `INSERT INTO clothing_items (user_id, image_url, original_filename, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, imageUrl, filename, fileSize, mimeType]
    )
    return result.rows[0]
  } catch (error) {
    console.error('Error saving clothing item:', error)
    throw new Error('Failed to save clothing item')
  }
}

export async function getUserClothingItems(userId: string): Promise<ClothingItem[]> {
  try {
    const result = await pool.query(
      `SELECT * FROM clothing_items 
       WHERE user_id = $1 AND is_active = true 
       ORDER BY uploaded_at DESC`,
      [userId]
    )
    return result.rows
  } catch (error) {
    console.error('Error fetching clothing items:', error)
    throw new Error('Failed to fetch clothing items')
  }
}

export async function deleteClothingItem(userId: string, itemId: number): Promise<boolean> {
  try {
    const result = await pool.query(
      `UPDATE clothing_items SET is_active = false 
       WHERE id = $1 AND user_id = $2`,
      [itemId, userId]
    )
    return (result.rowCount ?? 0) > 0
  } catch (error) {
    console.error('Error deleting clothing item:', error)
    throw new Error('Failed to delete clothing item')
  }
}