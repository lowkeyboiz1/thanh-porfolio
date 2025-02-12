import { db } from '@/lib/db'
import { DatabaseError, ValidationError } from '@/lib/errors'
import { COLLECTION_USER_NAME } from '@/utils/constans'
import * as jose from 'jose'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await db.collection(COLLECTION_USER_NAME).find().toArray()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const { email } = payload
    const user = await db.collection(COLLECTION_USER_NAME).findOne({ email })

    if (!user) {
      const result = await db.collection(COLLECTION_USER_NAME).insertOne(payload)
      return NextResponse.json({ ...payload, _id: result.insertedId })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json()
    const userToken = request.cookies.get('user')?.value

    if (!userToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY!)
    const verifiedUser = await jose.jwtVerify(userToken, secret)
    const userFromToken = verifiedUser.payload
    const result = await db.collection(COLLECTION_USER_NAME).updateOne({ email: userFromToken.email }, { $set: payload })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
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
