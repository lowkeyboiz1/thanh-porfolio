import clientPromise from './mongodb'

const DATABASE_NAME = process.env.NEXT_PUBLIC_DATABASE_NAME
const client = await clientPromise
const db = client.db(DATABASE_NAME)

export { db }
