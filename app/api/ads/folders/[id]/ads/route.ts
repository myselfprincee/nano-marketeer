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
    console.log('Fetching ads for folder ID:', resolvedParams.id) // Update log

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const folderId = parseInt(resolvedParams.id) // Use resolvedParams
    if (isNaN(folderId)) {
      return NextResponse.json({ error: 'Invalid folder ID' }, { status: 400 })
    }

    // First verify the folder exists and belongs to the user
    const folderCheck = await pool.query(`
      SELECT id FROM ad_folders 
      WHERE id = $1 AND user_id = $2 AND is_active = true
    `, [folderId, session.user.id])

    console.log('Folder check result:', folderCheck.rows)

    if (folderCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    // Now get all ads for this specific folder
    const result = await pool.query(`
      SELECT * FROM generated_ads 
      WHERE folder_id = $1 AND user_id = $2 AND is_active = true
      ORDER BY created_at DESC
    `, [folderId, session.user.id])

    console.log('Ads query result:', result.rows)

    return NextResponse.json({ 
      success: true, 
      ads: result.rows
    })

  } catch (error) {
    console.error('Error fetching folder ads:', error)
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 })
  }
}