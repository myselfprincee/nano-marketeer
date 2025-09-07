import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params // Add this line
    console.log('Fetching folder with ID:', resolvedParams.id) // Update log

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User ID:', session.user.id)

    const folderId = parseInt(resolvedParams.id) // Use resolvedParams
    if (isNaN(folderId)) {
      return NextResponse.json({ error: 'Invalid folder ID' }, { status: 400 })
    }

    const result = await pool.query(`
      SELECT * FROM ad_folders 
      WHERE id = $1 AND user_id = $2 AND is_active = true
    `, [folderId, session.user.id])

    console.log('Folder query result:', result.rows)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, folder: result.rows[0] })
  } catch (error) {
    console.error('Error fetching folder:', error)
    return NextResponse.json({ error: 'Failed to fetch folder' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params // Add this line
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const folderId = parseInt(resolvedParams.id) // Use resolvedParams
    const { name, description, style_template } = await request.json()

    const result = await pool.query(`
      UPDATE ad_folders 
      SET name = $1, description = $2, style_template = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5 AND is_active = true
      RETURNING *
    `, [name, description, JSON.stringify(style_template), folderId, session.user.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, folder: result.rows[0] })
  } catch (error) {
    console.error('Error updating folder:', error)
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params // Add this line
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const folderId = parseInt(resolvedParams.id) // Use resolvedParams

    await pool.query('BEGIN')
    
    try {
      await pool.query(`
        UPDATE generated_ads SET is_active = false 
        WHERE folder_id = $1 AND user_id = $2
      `, [folderId, session.user.id])

      const result = await pool.query(`
        UPDATE ad_folders SET is_active = false 
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `, [folderId, session.user.id])

      if (result.rows.length === 0) {
        await pool.query('ROLLBACK')
        return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
      }

      await pool.query('COMMIT')
      return NextResponse.json({ success: true, message: 'Folder deleted successfully' })
    } catch (error) {
      await pool.query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Error deleting folder:', error)
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 })
  }
}