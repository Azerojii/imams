'use client'

import { useRef, useEffect } from 'react'
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Heading1, Heading2, Link as LinkIcon, Quote, Code
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    
    onChange(newText)
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + before.length + selectedText.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const insertLineStart = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart)
    
    onChange(newText)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length)
    }, 0)
  }

  const toolbarButtons = [
    { icon: Bold, label: 'عريض', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'مائل', action: () => insertMarkdown('*', '*') },
    { icon: Underline, label: 'تحته خط', action: () => insertMarkdown('<u>', '</u>') },
    { icon: Heading1, label: 'عنوان كبير', action: () => insertLineStart('# ') },
    { icon: Heading2, label: 'عنوان صغير', action: () => insertLineStart('## ') },
    { icon: List, label: 'قائمة نقطية', action: () => insertLineStart('- ') },
    { icon: ListOrdered, label: 'قائمة مرقمة', action: () => insertLineStart('1. ') },
    { icon: Quote, label: 'اقتباس', action: () => insertLineStart('> ') },
    { icon: LinkIcon, label: 'رابط', action: () => insertMarkdown('[', '](url)') },
    { icon: Code, label: 'كود', action: () => insertMarkdown('`', '`') },
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            className="p-2 hover:bg-gray-200 rounded transition"
            title={button.label}
          >
            <button.icon size={18} />
          </button>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 focus:outline-none resize-none font-sans min-h-[250px] md:min-h-[400px]"
        rows={15}
      />

      {/* Helper Text */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-600">
        <p className="flex items-center gap-2">
          <span className="font-semibold">نصيحة:</span>
          <span>استخدم الأزرار أعلاه لتنسيق النص بسهولة</span>
        </p>
      </div>
    </div>
  )
}
