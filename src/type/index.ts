export type TPoject = {
  _id: string
  title: string
  description: string
  slug: string
  createdAt: Date
  updatedAt: Date
  image_review: {
    url: string
    fileId: number
  }
}
