import ToolButton from '@/components/RichEditor/ToolButton'
import { Editor } from '@tiptap/react'
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, Check, CodeIcon, DotIcon, ImageIcon, ItalicIcon, ListOrderedIcon, StrikethroughIcon, Trash2, UnderlineIcon } from 'lucide-react'
import { FC, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageKitFile } from '@/type'
import { chainMethods } from '@/utils/chainMethods'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, Loader2, Palette, Type, Upload, Youtube } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { deleteFile, getAllFiles } from '@/lib/imagekit'
import { useImageStore } from '@/store/useImageStore'

interface Props {
  editor: Editor | null
  onImageUpload?: (file: File) => Promise<string> // Add callback for image upload
  onSave?: (content: string, files: File[]) => Promise<void> // Add callback for saving content
}

const Tool: FC<Props> = ({ editor, onImageUpload, onSave }) => {
  const { listImageKits, setListImageKits } = useImageStore()

  const [url, setUrl] = useState<string>('')
  const [youtubeUrl, setYoutubeUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState<boolean>(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState<boolean>(false)
  const [linkUrl, setLinkUrl] = useState<string>('')
  const [isColorDialogOpen, setIsColorDialogOpen] = useState<boolean>(false)
  const [selectedColor, setSelectedColor] = useState<string>('#000000')
  const [isFontSizeDialogOpen, setIsFontSizeDialogOpen] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<string>('16')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]) // Track uploaded files
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [fileIdToDelete, setFileIdToDelete] = useState<string>('')
  const [isDeletingImage, setIsDeletingImage] = useState<boolean>(false)
  const [isFetchingImage, setIsFetchingImage] = useState<boolean>(false)
  const tools = [
    { name: 'bold', icon: <BoldIcon /> }, // Mark: bold
    { name: 'italic', icon: <ItalicIcon /> }, // Mark: italic
    { name: 'underline', icon: <UnderlineIcon /> }, // Mark: underline
    { name: 'strike', icon: <StrikethroughIcon /> }, // Mark: strike
    { name: 'code', icon: <CodeIcon /> }, // Mark: code
    { name: 'bulletList', icon: <DotIcon /> }, // Node: bullet list
    { name: 'orderedList', icon: <ListOrderedIcon /> }, // Node: ordered list
    { name: 'left', icon: <AlignLeftIcon /> }, // Special: text align left
    { name: 'center', icon: <AlignCenterIcon /> }, // Special: text align center
    { name: 'right', icon: <AlignRightIcon /> }, // Special: text align right
    { name: 'link', icon: <Link /> }, // Special: insert link
    { name: 'color', icon: <Palette /> }, // Special: text color
    { name: 'fontSize', icon: <Type /> }, // Special: font size
    { name: 'upload', icon: <ImageIcon /> }, // Special: insert image
    { name: 'youtube', icon: <Youtube /> } // Changed to Youtube icon
  ]
  const headingOptions = [
    { name: 'p', value: 'Paragraph' },
    { name: 'h1', value: 'Heading 1' },
    { name: 'h2', value: 'Heading 2' },
    { name: 'h3', value: 'Heading 3' }
  ] as const

  type THeading = (typeof headingOptions)[number]['name']

  const handleToolClick = (name: string) => {
    if (!editor) return
    switch (name) {
      case 'bold':
      case 'italic':
      case 'underline':
      case 'strike':
      case 'code':
        chainMethods(editor, (chain) => chain.toggleMark(name))
        break
      case 'bulletList':
        chainMethods(editor, (chain) => chain.toggleBulletList())
        break
      case 'orderedList':
        chainMethods(editor, (chain) => chain.toggleOrderedList())
        break
      case 'left':
        chainMethods(editor, (chain) => chain.setTextAlign('left'))
        break
      case 'center':
        chainMethods(editor, (chain) => chain.setTextAlign('center'))
        break
      case 'right':
        chainMethods(editor, (chain) => chain.setTextAlign('right'))
        break
      case 'link':
        setLinkUrl('')
        setIsLinkDialogOpen(true)
        break
      case 'color':
        setIsColorDialogOpen(true)
        break
      case 'fontSize':
        setIsFontSizeDialogOpen(true)
        break
      case 'upload':
        setIsOpen(true)
        break
      case 'youtube':
        setIsYoutubeDialogOpen(true)
        break
      default:
        console.warn(`Unknown tool: ${name}`)
    }
  }

  const handleSelectHeading = (value: THeading) => {
    if (!editor) return
    switch (value) {
      case 'p':
        chainMethods(editor, (chain) => chain.setParagraph())
        break
      case 'h1':
        chainMethods(editor, (chain) => chain.toggleHeading({ level: 1 }))
        break
      case 'h2':
        chainMethods(editor, (chain) => chain.toggleHeading({ level: 2 }))
        break
      case 'h3':
        chainMethods(editor, (chain) => chain.toggleHeading({ level: 3 }))
        break
      default:
        chainMethods(editor, (chain) => chain.setParagraph())
    }
  }

  const getSelectedHeadingLevel = () => {
    let result: THeading = 'p'
    if (editor?.isActive('heading', { level: 1 })) result = 'h1'
    if (editor?.isActive('heading', { level: 2 })) result = 'h2'
    if (editor?.isActive('heading', { level: 3 })) result = 'h3'
    return result
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFile(file)
    }
    e.target.value = ''
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      await handleFile(file)
    }
  }

  const handleFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsLoading(true)
      try {
        let imageUrl = ''
        if (onImageUpload) {
          // If upload callback provided, use it
          imageUrl = await onImageUpload(file)
        } else {
          // Fallback to base64
          imageUrl = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
        }

        if (editor && imageUrl) {
          setUploadedFiles((prev) => [...prev, file])
          chainMethods(editor, (chain) => chain.setImage({ src: imageUrl, alt: file.name }))
        }
      } catch (error) {
        console.error('Error handling file:', error)
      } finally {
        setIsLoading(false)
        setIsOpen(false)
      }
    }
  }

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const handleYoutubeUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value)
  }

  const handleLinkUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value)
  }

  const handleUrlSubmit = async () => {
    if (!url || !editor) return
    setIsLoading(true)
    try {
      chainMethods(editor, (chain) => chain.setImage({ src: url, alt: url }))
      setIsOpen(false)
    } catch (error) {
      console.error('Error setting image:', error)
    } finally {
      setUrl('')
      setIsLoading(false)
    }
  }

  const handleLinkSubmit = () => {
    if (!linkUrl || !editor) return
    chainMethods(editor, (chain) => chain.setLink({ href: linkUrl }))
    setLinkUrl('')
    setIsLinkDialogOpen(false)
  }

  const handleColorSubmit = () => {
    if (!editor) return
    console.log({ selectedColor })
    chainMethods(editor, (chain) => chain.setColor(selectedColor))
    setIsColorDialogOpen(false)
  }

  const handleFontSizeSubmit = () => {
    if (!editor) return
    // chainMethods(editor, (chain) => chain.setFontSize(fontSize + 'pt'))
    setIsFontSizeDialogOpen(false)
  }

  const handleYoutubeSubmit = async () => {
    if (!youtubeUrl || !editor) return
    setIsLoading(true)
    try {
      if (youtubeUrl) {
        editor.commands.setYoutubeVideo({
          src: youtubeUrl
        })
      }
      setIsYoutubeDialogOpen(false)
    } catch (error) {
      console.error('Error setting YouTube video:', error)
    } finally {
      setYoutubeUrl('')
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editor || !onSave) return

    const content = editor.getHTML()
    // Clear all base64 images from content before saving
    const contentClone = content
    const contentWithoutBase64 = contentClone.replace(/<img[^>]*src="data:image\/[^>]*>/g, '')

    await onSave(contentWithoutBase64, uploadedFiles)
  }

  const handleImageSelect = (item: ImageKitFile) => {
    if (!editor) return
    chainMethods(editor, (chain) => chain.setImage({ src: item.url, alt: item.name }))
    setIsOpen(false)
  }

  const handleImageDelete = async (fileId: string) => {
    setFileIdToDelete(fileId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    setIsDeletingImage(true)
    const newListImageKits = listImageKits.filter((item) => item.fileId !== fileIdToDelete)
    await deleteFile(fileIdToDelete)
    setListImageKits(newListImageKits)
    setIsDeleteDialogOpen(false)
    setFileIdToDelete('')
    setIsDeletingImage(false)
  }

  const fetchImageKits = async () => {
    try {
      const data = await getAllFiles()
      setListImageKits(data)
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setIsFetchingImage(false)
    }
  }

  useEffect(() => {
    setIsFetchingImage(true)
  }, [])

  useEffect(() => {
    if (listImageKits.length !== 0) return
    if (isFetchingImage) {
      fetchImageKits()
    }
  }, [isFetchingImage])

  return (
    <div className='relative top-0 flex flex-wrap gap-0.5'>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle className='hidden'>Upload Image</DialogTitle>
          <div className='rounded-xl p-6'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className='mb-6 text-center text-2xl font-semibold'>Upload Image</h2>
              <div className='flex flex-wrap gap-1'>
                {listImageKits.map((item) => {
                  if (item.fileType !== 'image') return
                  return (
                    <div key={item.fileId} className='relative size-[100px]'>
                      <Image src={item.url} alt={item.name} width={100} height={100} className='size-full object-cover' />
                      <div className='absolute bottom-0 flex items-center justify-center gap-2'>
                        <Button onClick={() => handleImageSelect(item)} size='sm' variant='secondary'>
                          <Check className='h-4 w-4' />
                        </Button>
                        <Button onClick={() => handleImageDelete(item.fileId)} size='sm' variant='destructive'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <AnimatePresence mode='wait'>
                <motion.div key='upload-options' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className='mb-4 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-all duration-300 hover:border-blue-500'
                  >
                    {isLoading ? <Loader2 className='mx-auto mb-4 animate-spin' size={48} /> : <Upload className='mx-auto mb-4' size={48} />}
                    <p className=''>Drag and drop an image here</p>
                    <p className='mt-2 text-sm'>or</p>
                    <Button onClick={() => fileInputRef.current?.click()} className='mt-4 bg-blue-500 text-white hover:bg-blue-600' disabled={isLoading}>
                      Select Image
                    </Button>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Input type='url' placeholder='Enter image URL' value={url} onChange={handleUrlChange} className='flex-grow' />
                    <Button onClick={handleUrlSubmit} disabled={!url || isLoading} className='bg-blue-500 text-white hover:bg-blue-600'>
                      {isLoading ? <Loader2 className='animate-spin' size={20} /> : <Link size={20} />}
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <input type='file' ref={fileInputRef} onChange={handleFileChange} accept='image/*' className='hidden' />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Delete</DialogTitle>
          <div className='p-6'>
            <p>Are you sure you want to delete this image?</p>
            <div className='mt-4 flex justify-end gap-2'>
              <Button onClick={() => setIsDeleteDialogOpen(false)} variant='outline'>
                Cancel
              </Button>
              <Button onClick={confirmDelete} variant='destructive' disabled={isDeletingImage}>
                {isDeletingImage ? <Loader2 className='animate-spin' size={20} /> : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogTitle>Insert Link</DialogTitle>
          <div className='p-6'>
            <div className='flex items-center space-x-2'>
              <Input type='url' placeholder='Enter URL' value={linkUrl} onChange={handleLinkUrlChange} className='flex-grow' />
              <Button onClick={handleLinkSubmit} disabled={!linkUrl} className='bg-blue-500 text-white hover:bg-blue-600'>
                <Link size={20} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <DialogContent>
          <DialogTitle>Choose Color</DialogTitle>
          <div className='p-6'>
            <div className='flex items-center space-x-2'>
              <Input type='color' value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className='h-10 w-20' />
              <Button onClick={handleColorSubmit} className='bg-blue-500 text-white hover:bg-blue-600'>
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFontSizeDialogOpen} onOpenChange={setIsFontSizeDialogOpen}>
        <DialogContent>
          <DialogTitle>Set Font Size</DialogTitle>
          <div className='p-6'>
            <div className='flex items-center space-x-2'>
              <Input type='number' value={fontSize} onChange={(e) => setFontSize(e.target.value)} min='8' max='72' className='w-20' />
              <span>pt</span>
              <Button onClick={handleFontSizeSubmit} className='bg-blue-500 text-white hover:bg-blue-600'>
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
        <DialogContent>
          <DialogTitle>Insert YouTube Video</DialogTitle>
          <div className='p-6'>
            <div className='flex items-center space-x-2'>
              <Input type='url' placeholder='Enter YouTube URL' value={youtubeUrl} onChange={handleYoutubeUrlChange} className='flex-grow' />
              <Button onClick={handleYoutubeSubmit} disabled={!youtubeUrl || isLoading} className='bg-red-500 text-white hover:bg-red-600'>
                {isLoading ? <Loader2 className='animate-spin' size={20} /> : <Youtube size={20} />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Select value={getSelectedHeadingLevel()} onValueChange={handleSelectHeading}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Select heading' />
        </SelectTrigger>
        <SelectContent>
          {headingOptions.map(({ name, value }) => (
            <SelectItem key={name} value={name}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {tools.map(({ name, icon }) => {
        return (
          <ToolButton
            key={name}
            isActive={editor?.isActive(name) || editor?.isActive({ textAlign: name }) || (name === 'fontSize' && editor?.isActive('textStyle', { fontSize: fontSize + 'pt' }))}
            onClick={() => handleToolClick(name)}
          >
            {icon}
          </ToolButton>
        )
      })}
      {onSave && (
        <Button onClick={handleSave} className='ml-2 bg-green-500 text-white hover:bg-green-600'>
          Save
        </Button>
      )}
    </div>
  )
}

export default Tool
