import { Item } from '@/components/table-with-drawer'

export const validateItem = (item: Partial<Item>, selectedFileImage: File | null) => {
  const newErrors = {
    title: '',
    description: '',
    client: '',
    category: '',
    year: '',
    scopeOfWork: '',
    image_review: '',
    detail: '',
    meta: ''
  }

  // Title validation
  if (!item.title?.trim()) {
    newErrors.title = 'Title is required'
  } else if (item.title.length < 3) {
    newErrors.title = 'Title must be at least 3 characters'
  } else if (item.title.length > 50) {
    newErrors.title = 'Title must be less than 50 characters'
  }

  // Description validation
  if (!item.description?.trim()) {
    newErrors.description = 'Description is required'
  } else if (item.description.length < 10) {
    newErrors.description = 'Description must be at least 10 characters'
  } else if (item.description.length > 500) {
    newErrors.description = 'Description must be less than 500 characters'
  }

  // Client validation
  if (!item.client?.trim()) {
    newErrors.client = 'Client is required'
  }

  // Category validation
  if (!item.category?.trim()) {
    newErrors.category = 'Category is required'
  }

  // Year validation
  if (!item.year?.trim()) {
    newErrors.year = 'Year is required'
  }

  // Scope of Work validation
  if (!item.scopeOfWork?.trim()) {
    newErrors.scopeOfWork = 'Scope of Work is required'
  }

  if (!item.detail?.trim()) {
    newErrors.detail = 'Detail is required'
  }

  if (!item.meta?.trim()) {
    newErrors.meta = 'Meta is required'
  }

  // Image validation
  if (!item.image_review && !selectedFileImage) {
    newErrors.image_review = 'Image is required'
  }

  const hasErrors = Object.values(newErrors).some((error) => error !== '')
  return { valid: !hasErrors, errors: newErrors }
}
