interface ImamIconProps {
  size?: number
  className?: string
}

export default function ImamIcon({ size = 24, className = '' }: ImamIconProps) {
  return (
    <svg
      aria-label="إمام"
      className={className}
      height={size}
      role="img"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      viewBox="0 0 100 100"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>imam</title>
      <path d="M5,100 C5,78 22,70 50,70 C78,70 95,78 95,100 Z" fill="currentColor" />
      <path d="M33,58 C29,66 30,78 50,81 C70,78 71,66 67,58 Z" fill="currentColor" />
      <ellipse cx="50" cy="47" rx="18" ry="20" fill="currentColor" />
      <rect x="27" y="34" width="46" height="9" rx="4" fill="currentColor" />
      <path d="M27,38 C25,18 75,18 73,38 Z" fill="currentColor" />
    </svg>
  )
}
