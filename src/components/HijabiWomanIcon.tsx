interface HijabiWomanIconProps {
  size?: number
  className?: string
}

export default function HijabiWomanIcon({ size = 24, className = '' }: HijabiWomanIconProps) {
  return (
    <img
      src="/muslimah.jpg"
      alt="مرشدة دينية"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', objectFit: 'contain' }}
    />
  )
}
