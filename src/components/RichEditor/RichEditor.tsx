'use client'
import { Tool } from '@/components/RichEditor'
import BulletList from '@tiptap/extension-bullet-list'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { FC } from 'react'
import './rickEdior.css'

interface Props {
  content: string
  uploadedFiles: File[]
  onSave: (content: string, uploadedFiles: File[]) => void
}

const RichEditor: FC<Props> = () => {
  const extensions = [
    Underline,
    BulletList,
    ListItem,
    OrderedList,
    TextAlign,
    Heading,
    Placeholder.configure({
      placeholder: 'Write something …'
    }),
    StarterKit,
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        class: 'rounded-lg max-h-[500px] w-auto mx-auto object-cover'
      }
    }),
    BulletList.configure({
      keepAttributes: false,
      keepMarks: true,
      itemTypeName: 'listItem'
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    })
  ]
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto outline-none'
      }
    }
  })

  return (
    <div className='flex flex-col gap-2'>
      <Tool editor={editor} />
      <div className='max-h-[400px] min-h-[100px] overflow-y-auto rounded-lg border border-gray-200 p-2'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default RichEditor
