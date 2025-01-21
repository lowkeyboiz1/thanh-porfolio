'use client'

import { createProject, deleteProject, getProjects, updateProject } from '@/apis/projects'
import { IProjectPayload } from '@/app/validators/projectValidator'
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
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, Loader2, Pencil, Plus, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface Item {
  _id: string
  title: string
  description: string
  image_review: {
    url: string
    fileId: string
  }
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
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFileImage, setSelectedFileImage] = useState<File | null>(null)
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    image_review: ''
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

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const data = await getProjects()
        setItems(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
        toast.error('Failed to load projects')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

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
      image_review: ''
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

    // Image validation
    if (!item.image_review && !selectedFileImage) {
      newErrors.image_review = 'Image is required'
    }

    const hasErrors = Object.values(newErrors).some((error) => error !== '')
    return { valid: !hasErrors, errors: newErrors }
  }

  const handleUpdate = async (updatedItem: Item) => {
    // Check if anything has changed
    if (!selectedFileImage && selectedItem?.title === updatedItem.title && selectedItem?.description === updatedItem.description && selectedItem?.image_review?.url === updatedItem.image_review?.url) {
      setIsSheetOpen(false)
      return
    }

    const { valid, errors: validationErrors } = validateItem(updatedItem)
    setIsUpdating(true)

    if (selectedFileImage) {
      const [imageUrl] = await uploadFiles([selectedFileImage as File])
      await deleteFile(selectedItem?.image_review?.fileId as string)
      updatedItem.image_review = {
        url: imageUrl.url,
        fileId: imageUrl.fileId
      }
    }
    if (!valid) {
      setErrors(validationErrors)
      toast.error('Please fill in all fields correctly')
      return
    }
    try {
      console.log({ updatedItem })
      const { title, description, _id, image_review } = updatedItem
      await updateProject({ title, description, _id, image_review })
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
    setIsDeleting(true)
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
      setIsDeleting(false)
    }
  }

  const handleAdd = async (newItem: IProjectPayload) => {
    const { valid, errors: validationErrors } = validateItem(newItem)
    if (!valid) {
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
      setSelectedFileImage(null)
      setImagePreview(null)
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error('Failed to add item')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className='mx-auto w-full p-4 2xl:max-w-[1400px]'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Projects</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add new project</Button>
          </DialogTrigger>
          <DialogContent className='w-full max-w-full lg:max-w-[80%] 2xl:max-w-[50%]'>
            <DialogHeader>
              <DialogTitle>Add new project</DialogTitle>
              <DialogDescription>Fill in the details for the new project.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                console.log(e.currentTarget, 'asdf')
                const formData = new FormData(e.currentTarget)
                const newItem = {
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  image_review: selectedFileImage
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
                  <RichEditor />
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
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className='text-center'>
                <Loader2 className='mx-auto h-6 w-6 animate-spin' />
              </TableCell>
            </TableRow>
          ) : (
            paginatedItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <div className='size-[100px] overflow-hidden rounded-lg'>
                    <Image src={item?.image_review?.url || ''} alt='Project Image' width={300} height={300} className='size-full object-cover' />
                  </div>
                </TableCell>
                <TableCell>
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant='outline'
                        onClick={() => {
                          setSelectedItem(item)
                          setImagePreview(item.image_review?.url || null)
                        }}
                      >
                        View Details
                      </Button>
                    </SheetTrigger>
                    <SheetContent side='right' className='!max-w-[calc(100vw-400px)]'>
                      <SheetHeader>
                        <SheetTitle>Project Details</SheetTitle>
                        <SheetDescription>View and edit project details</SheetDescription>
                      </SheetHeader>
                      {selectedItem && (
                        <div className='w-full py-4'>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              const formData = new FormData(e.currentTarget)
                              const updatedItem = {
                                ...selectedItem,
                                title: formData.get('title') as string,
                                description: formData.get('description') as string,
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
                            </div>
                            <div className='mt-4 flex justify-end space-x-2'>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant='destructive' disabled={isDeleting}>
                                    {isDeleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone. This will permanently delete the item.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(selectedItem._id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
