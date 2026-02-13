'use client'

import { useEffect } from 'react'

export default function EmojiProvider() {
  useEffect(() => {
    // Parse emojis when component mounts and when content changes
    const parseEmojis = () => {
      if (typeof window !== 'undefined' && (window as any).twemoji) {
        (window as any).twemoji.parse(document.body, {
          folder: 'svg',
          ext: '.svg'
        })
      }
    }

    // Initial parse
    parseEmojis()

    // Set up observer for dynamic content
    const observer = new MutationObserver(() => {
      parseEmojis()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  return null
}
