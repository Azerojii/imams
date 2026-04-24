interface MosqueIconProps {
  size?: number
  className?: string
}

export default function MosqueIcon({ size = 24, className = '' }: MosqueIconProps) {
  return (
    <svg
      aria-label="مسجد"
      className={className}
      height={size}
      role="img"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      viewBox="0 0 100 100"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>mosque</title>
      <rect x="16" y="52" width="68" height="48" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      <rect x="29" y="43" width="42" height="11" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      <path d="M29,43 C29,22 71,22 71,43 Z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      <rect x="76" y="22" width="9" height="78" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      <path d="M76,22 L80.5,8 L85,22 Z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      <rect x="73" y="42" width="15" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  )
}
