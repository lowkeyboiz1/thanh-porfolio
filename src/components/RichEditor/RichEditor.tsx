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
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import { EditorContent, useEditor } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import './rickEdior.css'
import TextStyle from '@tiptap/extension-text-style'
import { memo, useEffect, useState } from 'react'
import { getAllFiles } from '@/lib/imagekit'
import { ImageKitFile } from '@/type'

interface RichEditorProps {
  value?: string
  onChange?: (value: string) => void
}

const RichEditor: React.FC<RichEditorProps> = ({ value, onChange }) => {
  const extensions = [
    Underline,
    BulletList,
    ListItem,
    FontFamily,
    Youtube.configure({
      inline: false,
      enableIFrameApi: true,
      HTMLAttributes: {
        class: 'rounded-lg w-full mx-auto object-cover'
      }
    }),
    Link,
    Color,
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
        class: 'rounded-lg w-full mx-auto object-cover'
      }
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Document,
    Paragraph.configure({
      HTMLAttributes: {
        class: 'min-h-[1.5em]' // Add minimum height for empty paragraphs
      }
    }),
    TextStyle.configure({ mergeNestedSpanStyles: true }),
    Text,
    Heading.configure({
      levels: [1, 2, 3]
    })
  ]

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      if (!editor || !onChange) return
      const content = editor.getHTML()
      onChange(content)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto outline-none'
      }
    }
  })

  return (
    <div className='flex flex-col gap-2'>
      <Tool editor={editor} />
      <div className='rounded-lg border border-gray-200 p-2'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default memo(RichEditor)
