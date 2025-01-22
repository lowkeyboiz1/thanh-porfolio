import { getProjectDetail } from '@/apis/projects'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { COLLECTION_PROJECTS_NAME } from '@/app/api/projects/route'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  const projectdetail = await db.collection(COLLECTION_PROJECTS_NAME).findOne({ slug })

  return NextResponse.json(projectdetail)
}
