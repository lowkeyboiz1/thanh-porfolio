export class ValidationError extends Error {
  statusCode: number
  details: string[]

  constructor(message: string, details: string[] = [], statusCode = 400) {
    super(message)
    this.name = 'ValidationError'
    this.statusCode = statusCode
    this.details = details
  }
}

export class ApiError extends Error {
  statusCode: number
  details: string[]

  constructor(message: string, details: string[] = [], statusCode = 400) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details
  }
}

export class DatabaseError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.name = 'DatabaseError'
    this.statusCode = statusCode
  }
}

export class NotFoundError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 404) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = statusCode
  }
}
