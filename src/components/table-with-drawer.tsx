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
import { CSS } from '@dnd-kit/utilities'

import { RichEditor } from '@/components/RichEditor'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { deleteFile, uploadFiles } from '@/lib/imagekit'
import { motion } from 'framer-motion'
import { Eye, GripVertical, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { validateItem } from '@/utils/validateProject'
import { closestCenter, DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { DragStartEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { updateUser } from '@/apis/user'

export interface Item {
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
  meta: string
}

const initialErrors = {
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

export default function TableWithDrawer() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFileImage, setSelectedFileImage] = useState<File | null>(null)
  const [projectDetail, setProjectDetail] = useState<string | null>(null)
  const [projectDetailHTMLCreate, setProjectDetailHTMLCreate] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [errors, setErrors] = useState(initialErrors)

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB')
        return
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }

      setSelectedFileImage(file)
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      setErrors((prev) => ({ ...prev, image_review: '' }))

      if (e.target) {
        e.target.value = ''
      }
    },
    [imagePreview]
  )

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjects()
      setItems(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setIsFetching(false)
    }
  }, [])

  const handleUpdate = useCallback(
    async (updatedItem: Item) => {
      const hasChanges =
        selectedFileImage ||
        selectedItem?.title !== updatedItem.title ||
        selectedItem?.description !== updatedItem.description ||
        selectedItem?.client !== updatedItem.client ||
        selectedItem?.category !== updatedItem.category ||
        selectedItem?.year !== updatedItem.year ||
        selectedItem?.scopeOfWork !== updatedItem.scopeOfWork ||
        selectedItem?.meta !== updatedItem.meta ||
        projectDetail !== updatedItem.detail

      if (!hasChanges) {
        setIsSheetOpen(false)
        return
      }

      const { valid, errors: validationErrors } = validateItem(updatedItem, selectedFileImage)
      if (!valid) {
        setErrors(validationErrors)
        toast.error('Please fill in all fields correctly')
        return
      }

      setIsUpdating(true)

      try {
        if (selectedFileImage) {
          const [imageUrl] = await uploadFiles([selectedFileImage])
          await deleteFile(selectedItem?.image_review?.fileId as string)
          updatedItem.image_review = {
            url: imageUrl.url,
            fileId: imageUrl.fileId
          }
        }

        await updateProject(updatedItem)
        setItems((prev) => prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)))
        setIsSheetOpen(false)
        toast.success('Item updated successfully')
      } catch (error) {
        toast.error('Failed to update item')
        console.error('Error updating item:', error)
      } finally {
        setIsUpdating(false)
      }
    },
    [selectedFileImage, selectedItem, projectDetail]
  )

  const handleDelete = useCallback(async (itemId: string) => {
    setDeletingItemId(itemId)
    try {
      await deleteProject(itemId)
      setItems((prev) => prev.filter((item) => item._id !== itemId))
      setIsSheetOpen(false)
      toast.success('Item deleted successfully')
    } catch (error) {
      toast.error('Failed to delete item')
      console.error('Error deleting item:', error)
    } finally {
      setDeletingItemId(null)
    }
  }, [])

  const handleAdd = useCallback(
    async (newItem: IProjectPayload) => {
      const { valid, errors: validationErrors } = validateItem(newItem, selectedFileImage)
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
        setItems((prev) => [response, ...prev])
        setIsAddDialogOpen(false)

        // Reset form state
        setImagePreview(null)
        setSelectedFileImage(null)
        setProjectDetailHTMLCreate(null)
        setErrors(initialErrors)
      } catch (error) {
        console.error('Error adding item:', error)
        toast.error('Failed to add item')
      } finally {
        setIsAdding(false)
      }
    },
    [selectedFileImage]
  )

  useEffect(() => {
    if (isFetching) {
      fetchProjects()
    }
  }, [isFetching, fetchProjects])

  useEffect(() => {
    setIsFetching(true)
  }, [])

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleViewClick = useCallback((item: Item) => {
    setSelectedItem(item)
    setProjectDetail(item.detail)
    setImagePreview(item.image_review?.url || null)
    setIsSheetOpen(true)
  }, [])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item._id === active.id)
        const newIndex = items.findIndex((item) => item._id === over.id)
        const newDataProject = arrayMove(items, oldIndex, newIndex)

        setItems(newDataProject)
        setActiveId(null)
        const newOrderProjectIds = newDataProject.map((item) => item._id)

        await updateUser(newOrderProjectIds)
      }
    },
    [items]
  )

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
                  detail: formData.get('detail') as string,
                  meta: formData.get('meta') as string
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
                  <Label htmlFor='add-meta'>Meta</Label>
                  <Input id='add-meta' name='meta' placeholder='Enter meta' className={errors.meta ? 'border-red-500' : ''} onChange={() => setErrors((prev) => ({ ...prev, meta: '' }))} />
                  {errors.meta && <p className='text-sm text-red-500'>{errors.meta}</p>}
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

      {isFetching ? (
        <div className='flex justify-center'>
          <Loader2 className='h-6 w-6 animate-spin' />
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <DragOverlay>
              {activeId ? (
                <ProjectItem
                  deletingItemId={deletingItemId}
                  errors={errors}
                  handleDelete={handleDelete}
                  handleUpdate={handleUpdate}
                  handleViewClick={handleViewClick}
                  item={items.find((item) => item._id === activeId) as Item}
                  isSheetOpen={isSheetOpen}
                  isUpdating={isUpdating}
                  key={activeId}
                  setErrors={setErrors as any}
                  setIsSheetOpen={setIsSheetOpen}
                  setSelectedItem={setSelectedItem as any}
                  selectedItem={selectedItem as Item}
                  isDragging={false}
                />
              ) : null}
            </DragOverlay>

            <SortableContext items={items.map((item) => item._id)}>
              {items.map((item) => {
                return (
                  <ProjectItem
                    deletingItemId={deletingItemId}
                    errors={errors}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                    handleViewClick={handleViewClick}
                    item={item}
                    isSheetOpen={isSheetOpen}
                    isUpdating={isUpdating}
                    key={item._id}
                    setErrors={setErrors as any}
                    setIsSheetOpen={setIsSheetOpen}
                    setSelectedItem={setSelectedItem as any}
                    selectedItem={selectedItem as Item}
                    isDragging={item._id === activeId}
                  />
                )
              })}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}

const ProjectItem = ({
  item,
  selectedItem,
  handleViewClick,
  errors,
  setErrors,
  isSheetOpen,
  setIsSheetOpen,
  handleUpdate,
  handleDelete,
  deletingItemId,
  isUpdating,
  setSelectedItem,
  isDragging
}: {
  item: Item
  selectedItem: Item
  handleViewClick: (item: Item) => void
  errors: Record<string, string>
  setErrors: any
  isSheetOpen: boolean
  setIsSheetOpen: (isSheetOpen: boolean) => void
  handleUpdate: (item: Item) => void
  handleDelete: (itemId: string) => void
  deletingItemId: string | null
  isUpdating: boolean
  setSelectedItem: React.Dispatch<React.SetStateAction<Item>>
  isDragging: boolean
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id })
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputChangeRef = useRef<HTMLInputElement>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    opacity: isDragging ? 0.5 : 1
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div key={item._id} ref={setNodeRef} style={style} className='rounded-lg border bg-black p-4 shadow'>
      <div className='mb-4 overflow-hidden rounded-lg'>
        <Image src={item?.image_review?.url || ''} alt='Project Image' width={400} height={300} className='h-[200px] w-full object-cover' />
      </div>
      <h3 className='mb-2 line-clamp-1 text-lg font-semibold'>{item.title}</h3>
      <p className='mb-2 line-clamp-1 text-sm text-gray-600'>{item.description}</p>
      <div className='mb-2 space-y-1 text-sm'>
        <p className='line-clamp-1'>
          <span className='font-medium'>Client:</span> {item.client}
        </p>
        <p className='line-clamp-1'>
          <span className='font-medium'>Category:</span> {item.category}
        </p>
        <p className='line-clamp-1'>
          <span className='font-medium'>Year:</span> {item.year}
        </p>
        <p className='line-clamp-1'>
          <span className='font-medium'>Scope:</span> {item.scopeOfWork}
        </p>
        <p className='line-clamp-1'>
          <span className='font-medium'>Meta:</span> {item.meta}
        </p>
      </div>
      <div className='flex gap-2'>
        <Button variant='outline' size='sm' {...attributes} {...listeners}>
          <GripVertical className='h-4 w-4' />
        </Button>
        <Sheet open={isSheetOpen && selectedItem?._id === item._id} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant='outline' size='sm' onClick={() => handleViewClick(item)}>
              <Eye className='mr-2 h-4 w-4' />
              View
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
                      detail: formData.get('detail') as string,
                      meta: formData.get('meta') as string
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
                        onChange={() => setErrors((prev: any) => ({ ...prev, title: '' }))}
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
                        onChange={() => setErrors((prev: any) => ({ ...prev, description: '' }))}
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
                        onChange={() => setErrors((prev: any) => ({ ...prev, client: '' }))}
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
                        onChange={() => setErrors((prev: any) => ({ ...prev, category: '' }))}
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
                        onChange={() => setErrors((prev: any) => ({ ...prev, year: '' }))}
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
                        onChange={() => setErrors((prev: any) => ({ ...prev, scopeOfWork: '' }))}
                      />
                      {errors.scopeOfWork && <p className='text-sm text-red-500'>{errors.scopeOfWork}</p>}
                    </div>

                    <div>
                      <Label htmlFor='meta'>Meta</Label>
                      <Input
                        id='meta'
                        name='meta'
                        defaultValue={selectedItem.meta}
                        className={errors.meta ? 'border-red-500' : ''}
                        onChange={() => setErrors((prev: any) => ({ ...prev, meta: '' }))}
                      />
                      {errors.meta && <p className='text-sm text-red-500'>{errors.meta}</p>}
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
                              ...prev,
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
            <Button variant='destructive' size='sm' disabled={deletingItemId === item._id}>
              {deletingItemId === item._id ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash2 className='mr-2 h-4 w-4' />}
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
              <AlertDialogAction onClick={() => handleDelete(item._id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
