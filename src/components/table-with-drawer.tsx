'use client'

import { createProject, deleteProject, getProjects, updateProject } from '@/apis/projects'
import { IProjectPayload } from '@/validators/projectValidator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { RichEditor } from '@/components/RichEditor'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteFile, uploadFiles } from '@/lib/imagekit'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, Eye, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface Item {
  _id: string
  title: string
  description: string
  client: string
  category: string
  year: string
  scopeOfWork: string
  image_review: {
    url: string
    fileId: string
  }
  detail: string
}

const ITEMS_PER_PAGE = 5

export default function TableWithDrawer() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputChangeRef = useRef<HTMLInputElement>(null)

  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFileImage, setSelectedFileImage] = useState<File | null>(null)
  const [projectDetail, setProjectDetail] = useState<string | null>(null)
  const [projectDetailHTMLCreate, setProjectDetailHTMLCreate] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    client: '',
    category: '',
    year: '',
    scopeOfWork: '',
    image_review: '',
    detail: ''
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB')
        return
      }

      // Clear previous preview URL if exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }

      setSelectedFileImage(file)
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      setErrors((prev) => ({ ...prev, image_review: '' }))

      // Reset file input value to allow selecting same file again
      if (e.target) {
        e.target.value = ''
      }
    }
  }
  const fetchProjects = async () => {
    try {
      const data = await getProjects()
      setItems(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    // Cleanup image preview URL when component unmounts
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const validateItem = (item: Partial<Item>) => {
    const newErrors = {
      title: '',
      description: '',
      client: '',
      category: '',
      year: '',
      scopeOfWork: '',
      image_review: '',
      detail: ''
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

    // Image validation
    if (!item.image_review && !selectedFileImage) {
      newErrors.image_review = 'Image is required'
    }

    const hasErrors = Object.values(newErrors).some((error) => error !== '')
    return { valid: !hasErrors, errors: newErrors }
  }

  const handleUpdate = async (updatedItem: Item) => {
    // Check if anything has changed
    console.log({ selectedItem, updatedItem })
    if (
      !selectedFileImage &&
      selectedItem?.title === updatedItem.title &&
      selectedItem?.description === updatedItem.description &&
      selectedItem?.client === updatedItem.client &&
      selectedItem?.category === updatedItem.category &&
      selectedItem?.year === updatedItem.year &&
      selectedItem?.scopeOfWork === updatedItem.scopeOfWork &&
      selectedItem?.image_review?.url === updatedItem.image_review?.url &&
      projectDetail === updatedItem.detail
    ) {
      setIsSheetOpen(false)
      return
    }

    const { valid, errors: validationErrors } = validateItem(updatedItem)
    if (!valid) {
      setErrors(validationErrors)
      toast.error('Please fill in all fields correctly')
      return
    }

    setIsUpdating(true)

    try {
      if (selectedFileImage) {
        const [imageUrl] = await uploadFiles([selectedFileImage as File])
        await deleteFile(selectedItem?.image_review?.fileId as string)
        updatedItem.image_review = {
          url: imageUrl.url,
          fileId: imageUrl.fileId
        }
      }

      const { title, description, client, category, year, scopeOfWork, _id, image_review, detail } = updatedItem
      await updateProject({ title, description, client, category, year, scopeOfWork, _id, image_review, detail })
      setItems(items.map((item) => (item._id === updatedItem._id ? updatedItem : item)))
      setIsSheetOpen(false)
      toast.success('Item updated successfully')
    } catch (error) {
      toast.error('Failed to update item')
      console.error('Error updating item:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    setDeletingItemId(itemId)
    try {
      await deleteProject(itemId)
      setItems(items.filter((item) => item._id !== itemId))
      setIsSheetOpen(false)
      if (paginatedItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      toast.success('Item deleted successfully')
    } catch (error) {
      toast.error('Failed to delete item')
      console.error('Error deleting item:', error)
    } finally {
      setDeletingItemId(null)
    }
  }

  const handleAdd = async (newItem: IProjectPayload) => {
    const { valid, errors: validationErrors } = validateItem(newItem)
    if (!valid) {
      console.log({ valid, errors })
      setErrors(validationErrors)
      toast.error('Please fill in all fields correctly')
      return
    }

    setIsAdding(true)
    try {
      const [imageUrl] = await uploadFiles([selectedFileImage as File])
      const newPayload = {
        ...newItem,
        image_review: {
          url: imageUrl.url,
          fileId: imageUrl.fileId
        }
      }
      const response = await createProject(newPayload)
      toast.success('Item added successfully')
      setItems([...items, response])
      setCurrentPage(Math.ceil((items.length + 1) / ITEMS_PER_PAGE))
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error('Failed to add item')
    } finally {
      setImagePreview(null)
      setSelectedFileImage(null)
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
      setIsAdding(false)
    }
  }

  useEffect(() => {
    if (isFetching) {
      fetchProjects()
    }
  }, [isFetching])
  useEffect(() => {
    setIsFetching(true)
  }, [])
  return (
    <div className='mx-auto w-full p-4 2xl:max-w-[1400px]'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Projects</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add new project</Button>
          </DialogTrigger>
          <DialogContent className='max-h-[calc(100vh-100px)] w-full max-w-full lg:max-w-[80%] 2xl:max-w-[50%]'>
            <DialogHeader>
              <DialogTitle>Add new project</DialogTitle>
              <DialogDescription>Fill in the details for the new project.</DialogDescription>
            </DialogHeader>
            <form
              className='h-full max-h-[calc(100vh-200px)] overflow-y-auto px-1'
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const newItem = {
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  client: formData.get('client') as string,
                  category: formData.get('category') as string,
                  year: formData.get('year') as string,
                  scopeOfWork: formData.get('scopeOfWork') as string,
                  image_review: selectedFileImage,
                  detail: formData.get('detail') as string
                }
                handleAdd(newItem)
              }}
            >
              <div className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='add-title'>Title</Label>
                  <Input id='add-title' name='title' placeholder='Enter title' className={errors.title ? 'border-red-500' : ''} onChange={() => setErrors((prev) => ({ ...prev, title: '' }))} />
                  {errors.title && <p className='text-sm text-red-500'>{errors.title}</p>}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='add-description'>Description</Label>
                  <Input
                    id='add-description'
                    name='description'
                    placeholder='Enter description'
                    className={errors.description ? 'border-red-500' : ''}
                    onChange={() => setErrors((prev) => ({ ...prev, description: '' }))}
                  />
                  {errors.description && <p className='text-sm text-red-500'>{errors.description}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='add-client'>Client</Label>
                  <Input id='add-client' name='client' placeholder='Enter client' className={errors.client ? 'border-red-500' : ''} onChange={() => setErrors((prev) => ({ ...prev, client: '' }))} />
                  {errors.client && <p className='text-sm text-red-500'>{errors.client}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='add-category'>Category</Label>
                  <Input
                    id='add-category'
                    name='category'
                    placeholder='Enter category'
                    className={errors.category ? 'border-red-500' : ''}
                    onChange={() => setErrors((prev) => ({ ...prev, category: '' }))}
                  />
                  {errors.category && <p className='text-sm text-red-500'>{errors.category}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='add-year'>Year</Label>
                  <Input id='add-year' name='year' placeholder='Enter year' className={errors.year ? 'border-red-500' : ''} onChange={() => setErrors((prev) => ({ ...prev, year: '' }))} />
                  {errors.year && <p className='text-sm text-red-500'>{errors.year}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='add-scopeOfWork'>Scope of Work</Label>
                  <Input
                    id='add-scopeOfWork'
                    name='scopeOfWork'
                    placeholder='Enter scope of work'
                    className={errors.scopeOfWork ? 'border-red-500' : ''}
                    onChange={() => setErrors((prev) => ({ ...prev, scopeOfWork: '' }))}
                  />
                  {errors.scopeOfWork && <p className='text-sm text-red-500'>{errors.scopeOfWork}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='add-image'>Upload your image</Label>
                  <Input ref={fileInputRef} id='add-image' name='image' type='file' accept='image/*' onChange={handleImageChange} className={`${errors.image_review ? 'border-red-500' : ''} hidden`} />
                  {errors.image_review && <p className='text-sm text-red-500'>{errors.image_review}</p>}
                  {imagePreview ? (
                    <div className='relative mt-2 size-[200px]'>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (imagePreview) {
                            URL.revokeObjectURL(imagePreview)
                          }
                          setImagePreview(null)
                          setSelectedFileImage(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className='absolute right-2 top-2 rounded-full bg-black bg-opacity-50 p-1 text-white transition-colors hover:bg-opacity-75'
                        aria-label='Close preview'
                      >
                        <X className='h-5 w-5' />
                      </motion.button>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className='size-[200px] overflow-hidden rounded-lg'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          fileInputRef.current?.click()
                        }}
                      >
                        <Image src={imagePreview} alt='Preview' width={200} height={200} className='size-full object-cover' />
                      </motion.div>
                    </div>
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()} className='flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed py-10'>
                      <Plus className='mb-2 h-12 w-12 text-gray-400' />
                    </div>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='detail'>Detail Content</Label>
                  <RichEditor
                    onChange={(value) => {
                      setProjectDetailHTMLCreate(value)
                    }}
                  />
                  <input type='hidden' name='detail' value={projectDetailHTMLCreate || ''} />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit' disabled={isAdding}>
                  {isAdding && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  Add Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Scope of Work</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetching ? (
            <TableRow>
              <TableCell colSpan={8} className='text-center'>
                <Loader2 className='mx-auto h-6 w-6 animate-spin' />
              </TableCell>
            </TableRow>
          ) : (
            paginatedItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell>{item.scopeOfWork}</TableCell>
                <TableCell>
                  <div className='size-[100px] overflow-hidden rounded-lg'>
                    <Image src={item?.image_review?.url || ''} alt='Project Image' width={300} height={300} className='size-full object-cover' />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                      <SheetTrigger asChild>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => {
                            setSelectedItem(item)
                            setProjectDetail(item.detail)
                            setImagePreview(item.image_review?.url || null)
                          }}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side='right' className='!max-w-[calc(100vw-400px)]'>
                        <SheetHeader>
                          <SheetTitle>Project Detail #{selectedItem?.title}</SheetTitle>
                          <SheetDescription>View and edit project detail</SheetDescription>
                        </SheetHeader>
                        {selectedItem && (
                          <div className='w-full py-4'>
                            <form
                              className='h-full max-h-[calc(100vh-200px)] overflow-y-auto px-1'
                              onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                const updatedItem = {
                                  ...selectedItem,
                                  title: formData.get('title') as string,
                                  description: formData.get('description') as string,
                                  client: formData.get('client') as string,
                                  category: formData.get('category') as string,
                                  year: formData.get('year') as string,
                                  scopeOfWork: formData.get('scopeOfWork') as string,
                                  detail: formData.get('detail') as string
                                }
                                handleUpdate(updatedItem)
                              }}
                            >
                              <div className='space-y-4'>
                                <div>
                                  <Label htmlFor='title'>Title</Label>
                                  <Input
                                    id='title'
                                    name='title'
                                    defaultValue={selectedItem.title}
                                    className={errors.title ? 'border-red-500' : ''}
                                    onChange={() => setErrors((prev) => ({ ...prev, title: '' }))}
                                  />
                                  {errors.title && <p className='text-sm text-red-500'>{errors.title}</p>}
                                </div>

                                <div>
                                  <Label htmlFor='description'>Description</Label>
                                  <Input
                                    id='description'
                                    name='description'
                                    defaultValue={selectedItem.description}
                                    className={errors.description ? 'border-red-500' : ''}
                                    onChange={() => setErrors((prev) => ({ ...prev, description: '' }))}
                                  />
                                  {errors.description && <p className='text-sm text-red-500'>{errors.description}</p>}
                                </div>

                                <div>
                                  <Label htmlFor='client'>Client</Label>
                                  <Input
                                    id='client'
                                    name='client'
                                    defaultValue={selectedItem.client}
                                    className={errors.client ? 'border-red-500' : ''}
                                    onChange={() => setErrors((prev) => ({ ...prev, client: '' }))}
                                  />
                                  {errors.client && <p className='text-sm text-red-500'>{errors.client}</p>}
                                </div>

                                <div>
                                  <Label htmlFor='category'>Category</Label>
                                  <Input
                                    id='category'
                                    name='category'
                                    defaultValue={selectedItem.category}
                                    className={errors.category ? 'border-red-500' : ''}
                                    onChange={() => setErrors((prev) => ({ ...prev, category: '' }))}
                                  />
                                  {errors.category && <p className='text-sm text-red-500'>{errors.category}</p>}
                                </div>

                                <div>
                                  <Label htmlFor='year'>Year</Label>
                                  <Input
                                    id='year'
                                    name='year'
                                    defaultValue={selectedItem.year}
                                    className={errors.year ? 'border-red-500' : ''}
                                    onChange={() => setErrors((prev) => ({ ...prev, year: '' }))}
                                  />
                                  {errors.year && <p className='text-sm text-red-500'>{errors.year}</p>}
                                </div>

                                <div>
                                  <Label htmlFor='scopeOfWork'>Scope of Work</Label>
                                  <Input
                                    id='scopeOfWork'
                                    name='scopeOfWork'
                                    defaultValue={selectedItem.scopeOfWork}
                                    className={errors.scopeOfWork ? 'border-red-500' : ''}
                                    onChange={() => setErrors((prev) => ({ ...prev, scopeOfWork: '' }))}
                                  />
                                  {errors.scopeOfWork && <p className='text-sm text-red-500'>{errors.scopeOfWork}</p>}
                                </div>

                                <div>
                                  <Input
                                    ref={fileInputChangeRef}
                                    id='edit-image'
                                    name='image'
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    className={`${errors.image_review ? 'border-red-500' : ''} hidden`}
                                  />
                                  {errors.image_review && <p className='text-sm text-red-500'>{errors.image_review}</p>}
                                  {imagePreview && (
                                    <div className='relative mt-2 size-[200px] overflow-hidden rounded-lg'>
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          e.preventDefault()
                                          fileInputChangeRef.current?.click()
                                        }}
                                        className='absolute right-2 top-2 size-10 rounded-full bg-black bg-opacity-50 p-1 text-white transition-colors hover:bg-black/80'
                                      >
                                        <Pencil className='size-4' />
                                      </Button>
                                      <Image src={imagePreview} alt='Preview' width={400} height={400} className='size-full object-cover' />
                                    </div>
                                  )}
                                </div>
                                <div className='space-y-2'>
                                  <Label htmlFor='detail'>Detail Content</Label>
                                  <div className='sticky top-[200px]'>
                                    <RichEditor
                                      value={selectedItem?.detail || ''}
                                      onChange={(value) => {
                                        setSelectedItem((prev) => ({
                                          ...prev!,
                                          detail: value
                                        }))
                                      }}
                                    />
                                  </div>
                                  <input type='hidden' name='detail' value={selectedItem.detail} />
                                </div>
                              </div>
                              <div className='mt-4 flex justify-end space-x-2'>
                                <Button type='submit' disabled={isUpdating}>
                                  {isUpdating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                  Update
                                </Button>
                              </div>
                            </form>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='destructive' size='icon' disabled={deletingItemId === item._id}>
                          {deletingItemId === item._id ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash2 className='h-4 w-4' />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone. This will permanently delete the item.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item._id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button variant='outline' size='sm' onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          <ChevronsLeftIcon className='h-4 w-4' />
        </Button>
        <Button variant='outline' size='sm' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>
        <div className='flex items-center gap-1'>
          <p className='text-sm font-medium'>
            Page {currentPage} of {totalPages}
          </p>
        </div>
        <Button variant='outline' size='sm' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
        <Button variant='outline' size='sm' onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
          <ChevronsRightIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
