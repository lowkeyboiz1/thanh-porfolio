import { db } from '@/lib/db'
import { DatabaseError, ValidationError } from '@/lib/errors'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

const COLLECTION_CONTACTS_NAME = 'contacts'
const MAX_MESSAGES_PER_DAY = 3
const MESSAGE_COOLDOWN_MS = 60 * 1000 * 10 // 10 phút cooldown

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const { name, email, message } = payload

    // Lấy IP theo nhiều cách
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || (request as any).socket?.remoteAddress || 'Unknown'

    console.log('Client IP:', ip)

    // Kiểm tra nếu không lấy được IP
    if (!ip || ip === 'Unknown') {
      return NextResponse.json({ error: 'Could not determine IP address' }, { status: 500 })
    }

    // Kiểm tra thiếu thông tin đầu vào
    if (!name) return NextResponse.json({ error: 'Missing request name' }, { status: 400 })
    if (!email) return NextResponse.json({ error: 'Missing required field: email' }, { status: 400 })
    if (!message) return NextResponse.json({ error: 'Missing required field: message' }, { status: 400 })

    // Kiểm tra độ dài tin nhắn
    if (message.length > 300) {
      return NextResponse.json({ error: 'Message is too long. Maximum 300 characters allowed.' }, { status: 400 })
    }

    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // 🔹 **Kiểm tra số tin nhắn trong ngày từ cùng một IP**
    const ipDailyCount = await db.collection(COLLECTION_CONTACTS_NAME).countDocuments({
      ip,
      createdAt: { $gte: oneDayAgo }
    })

    if (ipDailyCount >= MAX_MESSAGES_PER_DAY) {
      return NextResponse.json({ error: 'Daily message limit exceeded for this IP. Try again tomorrow.' }, { status: 429 })
    }

    // 🔹 **Kiểm tra số tin nhắn trong ngày từ email**
    const emailDailyCount = await db.collection(COLLECTION_CONTACTS_NAME).countDocuments({
      email,
      createdAt: { $gte: oneDayAgo }
    })

    if (emailDailyCount >= MAX_MESSAGES_PER_DAY) {
      return NextResponse.json({ error: 'Daily message limit exceeded for this email. Try again tomorrow.' }, { status: 429 })
    }

    // 🔹 **Kiểm tra cooldown của IP**
    const lastMessageFromIp = await db.collection(COLLECTION_CONTACTS_NAME).findOne({ ip }, { sort: { createdAt: -1 } })

    if (lastMessageFromIp && now.getTime() - new Date(lastMessageFromIp.createdAt).getTime() < MESSAGE_COOLDOWN_MS) {
      return NextResponse.json({ error: 'Please wait before sending another message' }, { status: 429 })
    }

    // 🔹 **Kiểm tra cooldown của email**
    const lastMessageFromEmail = await db.collection(COLLECTION_CONTACTS_NAME).findOne({ email }, { sort: { createdAt: -1 } })

    if (lastMessageFromEmail && now.getTime() - new Date(lastMessageFromEmail.createdAt).getTime() < MESSAGE_COOLDOWN_MS) {
      return NextResponse.json({ error: 'Please wait before sending another message' }, { status: 429 })
    }

    // Lưu tin nhắn vào database
    const result = await db.collection(COLLECTION_CONTACTS_NAME).insertOne({
      name,
      email,
      message,
      createdAt: now,
      ip // Lưu IP vào database
    })

    if (!result.insertedId) {
      throw new DatabaseError('Failed to insert document')
    }

    return NextResponse.json({ _id: result.insertedId, name, email, message, createdAt: now, ip }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const contacts = await db.collection(COLLECTION_CONTACTS_NAME).find().toArray()
  return NextResponse.json(contacts)
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  await db.collection(COLLECTION_CONTACTS_NAME).deleteOne({ _id: new ObjectId(id) })
  return NextResponse.json({ message: 'Message deleted successfully' })
}
