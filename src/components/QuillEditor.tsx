'use client'

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import 'quill/dist/quill.snow.css'

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export interface QuillEditorHandle {
  insertCitation: (refId: string, refNumber: number) => void
}

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ align: [] }],
    ['clean'],
  ],
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'blockquote', 'code-block',
  'link', 'image',
  'align',
]

const QuillEditor = forwardRef<QuillEditorHandle, QuillEditorProps>(function QuillEditor({ value, onChange, placeholder }, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<InstanceType<typeof import('quill').default> | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useImperativeHandle(ref, () => ({
    insertCitation(refId: string, refNumber: number) {
      const quill = quillRef.current
      if (!quill) return
      const range = quill.getSelection(true)
      const marker = `<sup class="cite-ref" data-ref-id="${refId}">[${refNumber}]</sup>`
      quill.clipboard.dangerouslyPasteHTML(range.index, marker)
      quill.setSelection(range.index + 1, 0)
    },
  }))

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return

    import('quill').then(({ default: Quill }) => {
      if (!containerRef.current || quillRef.current) return

      const quill = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder: placeholder || 'ابدأ كتابة المقال هنا...',
        modules,
        formats,
      })

      quillRef.current = quill

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value)
      }

      quill.on('text-change', () => {
        onChangeRef.current(quill.root.innerHTML)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const quill = quillRef.current
    if (!quill) return
    if (quill.root.innerHTML !== value) {
      quill.clipboard.dangerouslyPasteHTML(value || '')
    }
  }, [value])

  return (
    <div className="quill-wrapper" dir="rtl">
      <div ref={containerRef} style={{ minHeight: '400px' }} />
      <style jsx global>{`
        .quill-wrapper .ql-container {
          font-size: 16px;
          font-family: 'Amiri', 'Scheherazade New', Georgia, serif;
          min-height: 400px;
          direction: rtl;
        }
        .quill-wrapper .ql-editor {
          min-height: 400px;
          line-height: 1.8;
          direction: rtl;
          text-align: right;
        }
        .quill-wrapper .ql-toolbar {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          border-color: #d1d5db;
          background: #f9fafb;
        }
        .quill-wrapper .ql-container {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          border-color: #d1d5db;
        }
        .quill-wrapper .ql-editor h2 {
          font-size: 1.5rem;
          font-weight: bold;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.25rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .quill-wrapper .ql-editor h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .quill-wrapper .ql-editor blockquote {
          border-right: 4px solid #d1d5db;
          border-left: none;
          padding-right: 1rem;
          padding-left: 0;
          font-style: italic;
          color: #4b5563;
        }
        .quill-wrapper .ql-editor .cite-ref {
          color: #067782;
          cursor: pointer;
          font-size: 0.75em;
          vertical-align: super;
        }
      `}</style>
    </div>
  )
})

export default QuillEditor
