import { db } from '@/lib/db'
import { DatabaseError, ValidationError } from '@/lib/errors'
import { deleteFile } from '@/lib/imagekit'
import { COLLECTION_PROJECTS_NAME, COLLECTION_USER_NAME } from '@/utils/constans'
import { createSlug } from '@/utils/createSlug'
import { mapOrder } from '@/utils/mapOrder'
import { validateProjectPayload } from '@/validators/projectValidator'
import * as jose from 'jose'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const emailAdmin = process.env.NEXT_PUBLIC_SECRET_GMAIL_ADMIN2

    const user = await db.collection(COLLECTION_USER_NAME).findOne({ email: emailAdmin })

    const projects = await db.collection(COLLECTION_PROJECTS_NAME).find().toArray()
    const orderProjectIds = user?.orderProjectIds.map((id: any) => id.toString())
    const orderedProjects = mapOrder(projects, orderProjectIds || [], '_id')

    return NextResponse.json(orderedProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const { title, description } = payload
    const userToken = request.cookies.get('user')?.value
    if (!userToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY!)
    const verifiedUser = await jose.jwtVerify(userToken, secret)

    // Early exit if payload is missing required fields
    if (!payload) {
      return NextResponse.json({ error: 'Missing request payload' }, { status: 400 })
    }
    if (!title) {
      return NextResponse.json({ error: 'Missing required field: title' }, { status: 400 })
    }
    if (!description) {
      return NextResponse.json({ error: 'Missing required field: description' }, { status: 400 })
    }

    // Create slug from title
    const slug = createSlug(title)

    // Check if project with same title or slug already exists
    const existingProject = await db.collection(COLLECTION_PROJECTS_NAME).findOne({
      $or: [{ title }, { slug }]
    })

    if (existingProject) {
      return NextResponse.json({ error: 'A project with this title already exists' }, { status: 409 })
    }

    const { valid, errors } = validateProjectPayload(payload)
    if (!valid) {
      throw new ValidationError('Validation failed', errors)
    }

    const data = {
      ...payload,
      slug,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log(data)

    const result = await db.collection(COLLECTION_PROJECTS_NAME).insertOne(data)
    if (!result.insertedId) {
      throw new DatabaseError('Failed to insert document')
    }
    const emailAdmin = process.env.NEXT_PUBLIC_SECRET_GMAIL_ADMIN2
    const user = await db.collection(COLLECTION_USER_NAME).findOne({ email: emailAdmin })
    const orderProjectIds = user?.orderProjectIds || []
    console.log({ user, orderProjectIds })
    await db.collection(COLLECTION_USER_NAME).updateOne(
      { email: user?.email },
      {
        $set: {
          orderProjectIds: [result.insertedId, ...orderProjectIds]
        }
      }
    )

    return NextResponse.json({ _id: result.insertedId, ...data }, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.statusCode })
    }

    if (error instanceof DatabaseError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json()

    // Early exit if payload is missing required fields
    if (!payload) {
      return NextResponse.json({ error: 'Missing request payload' }, { status: 400 })
    }
    if (!payload._id) {
      return NextResponse.json({ error: 'Missing required field: _id' }, { status: 400 })
    }
    if (!payload.title) {
      return NextResponse.json({ error: 'Missing required field: title' }, { status: 400 })
    }
    if (!payload.description) {
      return NextResponse.json({ error: 'Missing required field: description' }, { status: 400 })
    }

    const { valid, errors } = validateProjectPayload(payload)
    if (!valid) {
      throw new ValidationError('Validation failed', errors)
    }

    const { _id, detail, ...updateData } = payload
    const result = await db.collection(COLLECTION_PROJECTS_NAME).updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...updateData,
          detail: detail || '',
          updatedAt: new Date()
        }
      }
    )

    if (!result.matchedCount) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (!result.modifiedCount) {
      throw new DatabaseError('Failed to update document')
    }

    return NextResponse.json({ message: 'Project updated successfully' })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.statusCode })
    }

    if (error instanceof DatabaseError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await request.json()
    const { _id } = payload
    if (!_id) {
      return NextResponse.json({ error: 'Missing project ID' }, { status: 400 })
    }

    // Find project first to get image fileId
    const project = await db.collection(COLLECTION_PROJECTS_NAME).findOne({
      _id: new ObjectId(_id)
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete image from ImageKit
    if (project.image_review?.fileId) {
      await deleteFile(project.image_review.fileId)
    }

    const result = await db.collection(COLLECTION_PROJECTS_NAME).deleteOne({
      _id: new ObjectId(_id)
    })

    if (!result.deletedCount) {
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
