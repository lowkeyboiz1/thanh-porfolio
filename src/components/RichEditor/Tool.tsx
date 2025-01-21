import ToolButton from '@/components/RichEditor/ToolButton'
import { Editor } from '@tiptap/react'
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, CodeIcon, DotIcon, ImageIcon, ItalicIcon, ListOrderedIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react'
import { FC } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, Loader2, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'

interface Props {
  editor: Editor | null
  onImageUpload?: (file: File) => Promise<string> // Add callback for image upload
  onSave?: (content: string, files: File[]) => Promise<void> // Add callback for saving content
}

const Tool: FC<Props> = ({ editor, onImageUpload, onSave }) => {
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
    { name: 'upload', icon: <ImageIcon /> } // Special: insert image
  ]

  const handleToolClick = (name: string) => {
    if (!editor) return
    switch (name) {
      case 'bold':
      case 'italic':
      case 'underline':
      case 'strike':
      case 'code':
        editor.chain().focus().toggleMark(name).run()
        break
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run()
        break
      case 'left':
        editor.chain().focus().setTextAlign('left').run()
        break
      case 'center':
        editor.chain().focus().setTextAlign('center').run()
        break
      case 'right':
        editor.chain().focus().setTextAlign('right').run()
        break
      case 'upload':
        // Image handling is now done via dialog
        setIsOpen(true)
        break
      default:
        console.warn(`Unknown tool: ${name}`)
    }
  }

  const [url, setUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]) // Track uploaded files
  const [isOpen, setIsOpen] = useState<boolean>(false)

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
          editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run()
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

  const handleUrlSubmit = async () => {
    if (!url || !editor) return
    setIsLoading(true)
    try {
      editor.chain().focus().setImage({ src: url, alt: url }).run()
      setIsOpen(false)
    } catch (error) {
      console.error('Error setting image:', error)
    } finally {
      setUrl('')
      setIsLoading(false)
    }
  }

  // Function to save content and files
  const handleSave = async () => {
    if (!editor || !onSave) return

    const content = editor.getHTML()
    // Clear all base64 images from content before saving
    const contentClone = content
    const contentWithoutBase64 = contentClone.replace(/<img[^>]*src="data:image\/[^>]*>/g, '')

    await onSave(contentWithoutBase64, uploadedFiles)
  }

  if (!editor) return
  const content = editor.getHTML()
  const contentClone = content
  const contentWithoutBase64 = contentClone.replace(/src="data:image\/[^>]*>/g, uploadedFiles.length.toString())
  console.log({ contentWithoutBase64, uploadedFiles })

  return (
    <div className='relative top-0 flex gap-0.5'>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* <DialogTrigger asChild>
                <div>
                  <ToolButton isActive={editor?.isActive('image')} onClick={() => setIsOpen(true)}>
                    {icon}
                  </ToolButton>
                </div>
              </DialogTrigger> */}
        <DialogContent>
          <DialogTitle className='hidden'>Upload Image</DialogTitle>
          <div className='rounded-xl p-6'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className='mb-6 text-center text-2xl font-semibold'>Upload Image</h2>
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
      {tools.map(({ name, icon }) => {
        return (
          <ToolButton key={name} isActive={editor?.isActive(name) || editor?.isActive({ textAlign: name })} onClick={() => handleToolClick(name)}>
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
