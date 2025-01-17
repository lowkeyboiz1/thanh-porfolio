'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import { toast } from 'sonner'
import { getProjects, createProject, updateProject, deleteProject } from '@/apis/projects'
import { IProjectPayload } from '@/app/validators/projectValidator'
import { Upload } from './Upload'

interface Item {
  _id: string
  title: string
  href: string
  description: string
}

const ITEMS_PER_PAGE = 5

export default function TableWithDrawer() {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    href: ''
  })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects()
        setItems(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
        toast.error('Failed to load projects')
      }
    }

    fetchProjects()
  }, [])

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const validateItem = (item: Partial<Item>) => {
    const newErrors = {
      title: '',
      description: '',
      href: ''
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

    // URL validation
    if (!item.href?.trim()) {
      newErrors.href = 'HREF is required'
    } else {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
      if (!item.href || typeof item.href !== 'string' || !urlPattern.test(item.href)) {
        newErrors.href = 'HREF must be a valid URL.'
      }
    }

    const hasErrors = Object.values(newErrors).some((error) => error !== '')
    return { valid: !hasErrors, errors: newErrors }
  }

  const handleUpdate = async (updatedItem: Item) => {
    const { valid, errors: validationErrors } = validateItem(updatedItem)
    if (!valid) {
      setErrors(validationErrors)
      toast.error('Please fill in all fields correctly')
      return
    }
    try {
      const { title, description, href, _id } = updatedItem
      await updateProject({ title, description, href, _id })
      setItems(items.map((item) => (item._id === updatedItem._id ? updatedItem : item)))
      setIsSheetOpen(false)
      toast.success('Item updated successfully')
    } catch (error) {
      toast.error('Failed to update item')
      console.error('Error updating item:', error)
    }
  }

  const handleDelete = async (itemId: string) => {
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
    }
  }

  const handleAdd = async (newItem: IProjectPayload) => {
    const { valid, errors: validationErrors } = validateItem(newItem)
    if (!valid) {
      setErrors(validationErrors)
      toast.error('Please fill in all fields correctly')
      return
    }

    try {
      const response = await createProject(newItem)
      setItems([...items, response])
      setIsAddDialogOpen(false)
      setCurrentPage(Math.ceil((items.length + 1) / ITEMS_PER_PAGE))
      toast.success('Item added successfully')
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <Upload />
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Projects</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add new project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new project</DialogTitle>
              <DialogDescription>Fill in the details for the new project.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const newItem = {
                  title: formData.get('title') as string,
                  href: formData.get('href') as string,
                  description: formData.get('description') as string
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
                  <Label htmlFor='add-href'>Href</Label>
                  <Input id='add-href' name='href' placeholder='Enter href' className={errors.href ? 'border-red-500' : ''} onChange={() => setErrors((prev) => ({ ...prev, href: '' }))} />
                  {errors.href && <p className='text-sm text-red-500'>{errors.href}</p>}
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
              </div>
              <DialogFooter>
                <Button type='submit'>Add Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Href</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.href}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant='outline' onClick={() => setSelectedItem(item)}>
                      View Details
                    </Button>
                  </SheetTrigger>
                  <SheetContent side='right'>
                    <SheetHeader>
                      <SheetTitle>Item Details</SheetTitle>
                      <SheetDescription>View and edit item details</SheetDescription>
                    </SheetHeader>
                    {selectedItem && (
                      <div className='py-4'>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const updatedItem = {
                              ...selectedItem,
                              title: formData.get('title') as string,
                              href: formData.get('href') as string,
                              description: formData.get('description') as string
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
                              <Label htmlFor='href'>Href</Label>
                              <Input
                                id='href'
                                name='href'
                                defaultValue={selectedItem.href}
                                className={errors.href ? 'border-red-500' : ''}
                                onChange={() => setErrors((prev) => ({ ...prev, href: '' }))}
                              />
                              {errors.href && <p className='text-sm text-red-500'>{errors.href}</p>}
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
                          </div>
                          <div className='mt-4 flex justify-end space-x-2'>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant='destructive'>Delete</Button>
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
                            <Button type='submit'>Update</Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              </TableCell>
            </TableRow>
          ))}
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
