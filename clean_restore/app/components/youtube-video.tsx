"use client"

interface YouTubeVideoProps {
  videoId: string
  title?: string
}

export default function YouTubeVideo({ videoId, title }: YouTubeVideoProps) {
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute inset-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'YouTube video player'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
} 