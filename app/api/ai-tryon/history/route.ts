import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in' 
      }, { status: 401 })
    }

    const result = await pool.query(
      `SELECT * FROM tryon_results 
       WHERE user_id = $1 AND is_active = true 
       ORDER BY created_at DESC`,
      [session.user.id]
    )

    return NextResponse.json({
      success: true,
      results: result.rows
    })

  } catch (error) {
    console.error('Error fetching try-on history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch try-on history' },
      { status: 500 }
    )
  }
}