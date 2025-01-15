import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateProjectPayload } from '@/app/validators/projectValidator'
import { ValidationError, DatabaseError } from '@/lib/errors'

const COLLECTION_NAME = 'projects'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const { valid, errors } = validateProjectPayload(payload)

    if (!valid) {
      throw new ValidationError('Validation failed', errors)
    }

    const data = { ...payload, createdAt: new Date(), updatedAt: new Date() }

    const result = await db.collection(COLLECTION_NAME).insertOne(data)
    if (!result.insertedId) {
      throw new DatabaseError('Failed to insert document')
    }

    return NextResponse.json({ id: result.insertedId, ...data }, { status: 201 })
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
