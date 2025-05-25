
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { Button } from './button'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Image as ImageIcon, Variable } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onAddVariable?: (variable: string) => void
}

const variables = [
  '{{nome_cliente}}',
  '{{endereco_infrator}}',
  '{{marca}}',
  '{{data_atual}}',
  '{{razao_social}}'
]

export function RichTextEditor({ value, onChange, placeholder, onAddVariable }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Digite o conteúdo...',
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  const insertVariable = (variable: string) => {
    editor.commands.insertContent(variable)
    onAddVariable?.(variable)
  }

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex items-center gap-1 flex-wrap">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          data-active={editor.isActive('underline')}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        
        <div className="ml-auto flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const url = window.prompt('URL da imagem:')
              if (url) editor.chain().focus().setImage({ src: url }).run()
            }}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const variable = variables[0]
              insertVariable(variable)
            }}
          >
            <Variable className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} className="min-h-[400px] p-4 prose max-w-none" />
    </div>
  )
}
