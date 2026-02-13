import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-heading mb-4 text-text-primary">المقال غير موجود</h2>
        <p className="text-text-secondary mb-8">
          المقال الذي تبحث عنه غير موجود في الموسوعة.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="btn-primary"
          >
            العودة إلى الرئيسية
          </Link>
          <Link
            href="/submit"
            className="btn-accent"
          >
            تقديم مقال
          </Link>
        </div>
      </div>
    </div>
  )
}
