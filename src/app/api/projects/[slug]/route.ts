import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { COLLECTION_PROJECTS_NAME } from '@/utils/constans'

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { slug } = params

    const projectDetail = await db.collection(COLLECTION_PROJECTS_NAME).findOne({ slug })

    if (!projectDetail) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(projectDetail)
  } catch (error) {
    console.error('Error fetching project detail:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
