export type TProject = {
  _id: string
  title: string
  description: string
  detail: string
  slug: string
  createdAt: Date
  updatedAt: Date
  client: string
  category: string
  scopeOfWork: string
  year: string
  image_review: {
    url: string
    fileId: number
  }
}
