import { NextResponse } from 'next/server'
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
      SELECT ga.*, af.name as folder_name
      FROM generated_ads ga
      LEFT JOIN ad_folders af ON ga.folder_id = af.id
      WHERE ga.user_id = $1 AND ga.is_active = true
      ORDER BY ga.created_at DESC
      LIMIT 20
    `, [session.user.id])

    return NextResponse.json({
      success: true,
      ads: result.rows
    })

  } catch (error) {
    console.error('Error fetching recent ads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent ads' },
      { status: 500 }
    )
  }
}