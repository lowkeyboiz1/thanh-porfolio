'use client'
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
import moment from 'moment'

import { deleteContactMessage, getContactMessages } from '@/apis/contact'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, Eye, Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

const ITEMS_PER_PAGE = 5
const UTC_VIETNAM = 7
interface IItems {
  _id: string
  name: string
  email: string
  message: string
  createdAt: string
  ip: string
}

const TableComponent = () => {
  const [items, setItems] = useState<IItems[]>([])
  const [selectedMessage, setSelectedMessage] = useState<IItems | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => {
    const handleFetchMessages = async () => {
      setIsLoading(true)
      try {
        const messages = await getContactMessages()
        setItems(messages)
      } catch (error) {
        toast.error('Failed to fetch messages')
      } finally {
        setIsLoading(false)
      }
    }
    handleFetchMessages()
  }, [])

  const handleDelete = async (itemId: string) => {
    setDeletingItemId(itemId)
    try {
      await deleteContactMessage(itemId)
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId))
      if (paginatedItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      toast.success('Message deleted successfully')
      setIsAlertOpen(false)
    } catch (error) {
      toast.error('Failed to delete message')
      console.error('Error deleting message:', error)
    } finally {
      setDeletingItemId(null)
    }
  }

  return (
    <div className='mx-auto w-full p-4 2xl:max-w-[1400px]'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Messages</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
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
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <div className='max-w-[200px] truncate 2xl:max-w-[400px]'>{item.message}</div>
                </TableCell>
                <TableCell>{moment.utc(item.createdAt).add(UTC_VIETNAM, 'hours').format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                <TableCell className='flex gap-2'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant='outline' size='icon' onClick={() => setSelectedMessage(item)}>
                        <Eye className='h-4 w-4' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-[700px] overflow-y-auto'>
                      <DialogHeader>
                        <DialogTitle>Message Details</DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <div>
                          <Label>Name</Label>
                          <p>{selectedMessage?.name}</p>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <p>{selectedMessage?.email}</p>
                        </div>
                        <div>
                          <Label>Message</Label>
                          <Textarea
                            className='whitespace-pre-wrap break-words border-none outline-none focus:border-none focus:shadow-none focus:outline-none focus:ring-0'
                            value={selectedMessage?.message}
                            readOnly
                            rows={10}
                          />
                        </div>
                        <div>
                          <Label>Date</Label>
                          <p>{moment.utc(selectedMessage?.createdAt).add(UTC_VIETNAM, 'hours').format('DD/MM/YYYY HH:mm:ss')}</p>
                        </div>
                        <div>
                          <Label>IP Address</Label>
                          <p>{selectedMessage?.ip}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant='destructive' size='icon' disabled={deletingItemId === item._id}>
                        {deletingItemId === item._id ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash2 className='h-4 w-4' />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this message? This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item._id)} disabled={deletingItemId === item._id} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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

export default TableComponent
