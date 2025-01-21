import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateProjectPayload } from '@/app/validators/projectValidator'
import { ValidationError, DatabaseError } from '@/lib/errors'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'projects'

export async function GET() {
  try {
    const projects = await db.collection(COLLECTION_NAME).find().toArray()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    // Early exit if payload is missing required fields
    if (!payload) {
      return NextResponse.json({ error: 'Missing request payload' }, { status: 400 })
    }
    if (!payload.title) {
      return NextResponse.json({ error: 'Missing required field: title' }, { status: 400 })
    }
    if (!payload.description) {
      return NextResponse.json({ error: 'Missing required field: description' }, { status: 400 })
    }

    // Check if project with same title already exists
    const existingProject = await db.collection(COLLECTION_NAME).findOne({
      title: payload.title
    })

    if (existingProject) {
      return NextResponse.json({ error: 'A project with this title already exists' }, { status: 409 })
    }

    const { valid, errors } = validateProjectPayload(payload)
    if (!valid) {
      throw new ValidationError('Validation failed', errors)
    }

    const data = { ...payload, createdAt: new Date(), updatedAt: new Date() }

    const result = await db.collection(COLLECTION_NAME).insertOne(data)
    if (!result.insertedId) {
      throw new DatabaseError('Failed to insert document')
    }

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

    const { _id, ...updateData } = payload
    const result = await db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(_id) }, { $set: { ...updateData, updatedAt: new Date() } })

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

    const result = await db.collection(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(_id)
    })

    if (!result.deletedCount) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
