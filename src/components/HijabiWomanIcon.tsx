interface HijabiWomanIconProps {
  size?: number
  className?: string
}

export default function HijabiWomanIcon({ size = 24, className = '' }: HijabiWomanIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Face */}
      <circle cx="12" cy="10" r="3" />
      {/* Hijab wrapping around head and draping down */}
      <path d="M7 13 C5 12 4.5 10 4.5 8.5 C4.5 5 8 2.5 12 2.5 C16 2.5 19.5 5 19.5 8.5 C19.5 10 19 12 17 13 L15 14.5 L9 14.5 Z" />
      {/* Body / shoulders */}
      <path d="M9 14.5 L7 21 L17 21 L15 14.5" />
    </svg>
  )
}
