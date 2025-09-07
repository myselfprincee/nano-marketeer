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

        // Get try-ons count
        const tryOnsResult = await pool.query(
            `SELECT COUNT(*) as count FROM tryon_results WHERE user_id = $1 AND is_active = true`,
            [session.user.id]
        )

        // Get custom models count
        const modelsResult = await pool.query(
            `SELECT COUNT(*) as count FROM custom_models WHERE user_id = $1 AND is_active = true`,
            [session.user.id]
        )

        // Get clothing items count
        const clothingResult = await pool.query(
            `SELECT COUNT(*) as count FROM clothing_items WHERE user_id = $1 AND is_active = true`,
            [session.user.id]
        )

        // Get user creation date (you might need to add this to your users table)
        const joinDate = new Date(Date.now()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })

        const stats = {
            totalTryOns: parseInt(tryOnsResult.rows[0]?.count || '0'),
            totalCampaigns: 0, // Future feature
            totalModels: parseInt(modelsResult.rows[0]?.count || '0'),
            totalClothing: parseInt(clothingResult.rows[0]?.count || '0'),
            joinDate
        }

        return NextResponse.json({
            success: true,
            stats
        })

    } catch (error) {
        console.error('Error fetching account stats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch account stats' },
            { status: 500 }
        )
    }
}