'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'

interface ImageUploaderProps {
  onImageInsert: (markdown: string) => void
  onImageSelected?: (info: { src: string; caption?: string }) => void
}

export default function ImageUploader({ onImageInsert, onImageSelected }: ImageUploaderProps) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [caption, setCaption] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUrlSubmit = () => {
    if (imageUrl) {
      const markdown = caption
        ? `![${altText || 'Image'}](${imageUrl})\n*${caption}*\n`
        : `![${altText || 'Image'}](${imageUrl})\n`
      onImageInsert(markdown)
      onImageSelected?.({ src: imageUrl, caption: caption || undefined })
      setImageUrl('')
      setAltText('')
      setCaption('')
      setShowUrlInput(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (limit to 4.5MB)
    if (file.size > 4.5 * 1024 * 1024) {
      alert('L\'image est trop grande. Veuillez utiliser une image de moins de 4.5 Mo.')
      return
    }

    setIsUploading(true)

    try {
      // Upload to Vercel Blob
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await response.json()
      
      // Insert markdown with the uploaded image URL
      const markdown = caption
        ? `![${altText || file.name}](${data.url})\n*${caption}*\n`
        : `![${altText || file.name}](${data.url})\n`
      
      onImageInsert(markdown)
      onImageSelected?.({ src: data.url, caption: caption || undefined })
      setAltText('')
      setCaption('')
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Échec du téléchargement de l\'image. Veuillez réessayer.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon size={20} className="text-primary" />
        <h3 className="font-bold text-sm">Ajouter une image</h3>
      </div>

      <div className="space-y-3">
        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={18} />
          <span className="text-sm">
            {isUploading ? 'Téléchargement...' : 'Télécharger une image'}
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* URL Input Toggle */}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          <LinkIcon size={18} />
          <span className="text-sm">Ajouter une URL d'image</span>
        </button>

        {/* URL Input Form */}
        {showUrlInput && (
          <div className="space-y-2 p-3 bg-white rounded border border-gray-200">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Texte alternatif (optionnel)"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Légende (optionnel)"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="flex-1 px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary/90"
              >
                Insérer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false)
                  setImageUrl('')
                  setAltText('')
                  setCaption('')
                }}
                className="px-3 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="text-xs text-text-secondary mt-2">
          الحد الأقصى لحجم الصورة: 4.5 ميغابايت
        </div>
      </div>
    </div>
  )
}
