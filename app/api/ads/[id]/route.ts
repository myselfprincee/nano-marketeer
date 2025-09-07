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
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adId = parseInt(resolvedParams.id) // Use resolvedParams instead of params
    const result = await pool.query(`
      SELECT ga.*, af.name as folder_name
      FROM generated_ads ga
      LEFT JOIN ad_folders af ON ga.folder_id = af.id
      WHERE ga.id = $1 AND ga.user_id = $2 AND ga.is_active = true
    `, [adId, session.user.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, ad: result.rows[0] })
  } catch (error) {
    console.error('Error fetching ad:', error)
    return NextResponse.json({ error: 'Failed to fetch ad' }, { status: 500 })
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

    const adId = parseInt(resolvedParams.id) // Use resolvedParams
    const result = await pool.query(`
      UPDATE generated_ads SET is_active = false 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [adId, session.user.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Ad deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting ad:', error)
    return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 })
  }
}