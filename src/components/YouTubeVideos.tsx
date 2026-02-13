'use client'

interface YouTubeVideosProps {
  videos: string[]
}

/**
 * Extract YouTube video ID from various URL formats
 */
function getYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    
    // Handle youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v')
    }
    
    // Handle youtu.be/VIDEO_ID
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1)
    }
    
    return null
  } catch {
    return null
  }
}

export default function YouTubeVideos({ videos }: YouTubeVideosProps) {
  if (!videos || videos.length === 0) {
    return null
  }

  return (
    <div className="mt-8 mb-8">
      <h2 className="text-2xl font-serif font-bold mb-4 border-b border-gray-300 pb-2">
        Vidéos
      </h2>
      <div className="space-y-6">
        {videos.map((videoUrl, index) => {
          const videoId = getYouTubeVideoId(videoUrl)
          
          if (!videoId) {
            return (
              <div key={index} className="text-red-600 text-sm">
                Lien YouTube invalide: {videoUrl}
              </div>
            )
          }

          return (
            <div key={index} className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`YouTube video ${index + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
