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

export type ImageKitFile = {
  type: string
  name: string
  createdAt: string
  updatedAt: string
  fileId: string
  tags: null | string[]
  AITags: null | string[]
  versionInfo: {
    id: string
    name: string
  }
  embeddedMetadata: {
    ImageHeight: number
    ImageWidth: number
    ColorSpace: string
    DateCreated: string
    DateTimeCreated: string
  }
  isPublished: boolean
  customCoordinates: null | string
  customMetadata: Record<string, unknown>
  isPrivateFile: boolean
  url: string
  thumbnail: string
  fileType: string
  filePath: string
  height: number
  width: number
  size: number
  hasAlpha: boolean
  mime: string
}
