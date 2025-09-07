import { NextResponse } from 'next/server'
import { getUserClothingItems } from '@/app/utils/clothingMethods'
import { auth } from '@/app/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await getUserClothingItems(session.user.id)

    return NextResponse.json({
      success: true,
      items: items
    })

  } catch (error) {
    console.error('Error fetching clothing items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}