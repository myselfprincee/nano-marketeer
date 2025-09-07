import { NextResponse } from 'next/server'
import { getUserCustomModels } from '@/app/utils/modelMethods'
import { auth } from '@/app/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const models = await getUserCustomModels(session.user.id)

    return NextResponse.json({
      success: true,
      models: models
    })

  } catch (error) {
    console.error('Error fetching custom models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}