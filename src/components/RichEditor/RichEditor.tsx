'use client'
import { Tool } from '@/components/RichEditor'
import Text from '@tiptap/extension-text'
import BulletList from '@tiptap/extension-bullet-list'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Image from '@tiptap/extension-image'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './rickEdior.css'

const RichEditor = () => {
  const extensions = [
    Underline,
    BulletList,
    ListItem,
    OrderedList,
    BulletList.configure({
      HTMLAttributes: {
        class: 'list-disc'
      }
    }),
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
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Document,
    Paragraph,
    Text,
    Heading.configure({
      levels: [1, 2, 3]
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
