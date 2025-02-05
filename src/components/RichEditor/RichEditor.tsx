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
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: {
        class: 'font-bold text-blue-500 underline'
      },
      protocols: ['http', 'https'],
      isAllowedUri: (url, ctx) => {
        try {
          // construct URL
          const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

          // use default validation
          if (!ctx.defaultValidate(parsedUrl.href)) {
            return false
          }

          // disallowed protocols
          const disallowedProtocols = ['ftp', 'file', 'mailto']
          const protocol = parsedUrl.protocol.replace(':', '')

          if (disallowedProtocols.includes(protocol)) {
            return false
          }

          // only allow protocols specified in ctx.protocols
          const allowedProtocols = ctx.protocols.map((p) => (typeof p === 'string' ? p : p.scheme))

          if (!allowedProtocols.includes(protocol)) {
            return false
          }

          // disallowed domains
          const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
          const domain = parsedUrl.hostname

          if (disallowedDomains.includes(domain)) {
            return false
          }

          // all checks have passed
          return true
        } catch {
          return false
        }
      },
      shouldAutoLink: (url) => {
        try {
          // construct URL
          const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

          // only auto-link if the domain is not in the disallowed list
          const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
          const domain = parsedUrl.hostname

          return !disallowedDomains.includes(domain)
        } catch {
          return false
        }
      }
    }),
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
