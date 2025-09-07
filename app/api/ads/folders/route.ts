import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await pool.query(`
      SELECT 
        f.*,
        COUNT(a.id) as ad_count
      FROM ad_folders f
      LEFT JOIN generated_ads a ON f.id = a.folder_id AND a.is_active = true
      WHERE f.user_id = $1 AND f.is_active = true
      GROUP BY f.id
      ORDER BY f.created_at DESC
    `, [session.user.id])

    return NextResponse.json({ success: true, folders: result.rows })
  } catch (error) {
    console.error('Error fetching folders:', error)
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description } = await request.json()

    const result = await pool.query(`
      INSERT INTO ad_folders (user_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [session.user.id, name, description])

    return NextResponse.json({ success: true, folder: result.rows[0] })
  } catch (error) {
    console.error('Error creating folder:', error)
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
  }
}