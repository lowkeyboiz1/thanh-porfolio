import { ChainedCommands, Editor } from '@tiptap/react'

export const chainMethods = (editor: Editor | null, command: (chain: ChainedCommands) => ChainedCommands) => {
  if (!editor) return

  command(editor.chain().focus()).run()
}
