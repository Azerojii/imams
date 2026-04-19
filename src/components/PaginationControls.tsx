import Link from 'next/link'

interface PaginationControlsProps {
  basePath: string
  currentPage: number
  totalPages: number
}

function buildHref(basePath: string, page: number): string {
  const [path, existingQuery] = basePath.split('?')
  const params = new URLSearchParams(existingQuery || '')
  if (page <= 1) {
    params.delete('page')
  } else {
    params.set('page', String(page))
  }
  const queryString = params.toString()
  return queryString ? `${path}?${queryString}` : path
}

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
  return Array.from(pages)
    .filter(page => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)
}

export default function PaginationControls({
  basePath,
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null
  }

  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={buildHref(basePath, Math.max(1, currentPage - 1))}
        className={`rounded-md border px-3 py-1.5 text-sm transition-colors hover:no-underline ${
          currentPage === 1
            ? 'pointer-events-none border-border-light text-text-secondary opacity-50'
            : 'border-border text-primary hover:bg-primary/10'
        }`}
      >
        السابق
      </Link>

      {visiblePages.map((page, index) => {
        const previousPage = visiblePages[index - 1]
        const showDots = previousPage && page - previousPage > 1

        return (
          <div key={page} className="flex items-center gap-2">
            {showDots && <span className="px-1 text-text-secondary">...</span>}
            <Link
              href={buildHref(basePath, page)}
              className={`min-w-9 rounded-md border px-3 py-1.5 text-center text-sm transition-colors hover:no-underline ${
                page === currentPage
                  ? 'border-primary bg-primary text-white'
                  : 'border-border text-primary hover:bg-primary/10'
              }`}
            >
              {page}
            </Link>
          </div>
        )
      })}

      <Link
        href={buildHref(basePath, Math.min(totalPages, currentPage + 1))}
        className={`rounded-md border px-3 py-1.5 text-sm transition-colors hover:no-underline ${
          currentPage === totalPages
            ? 'pointer-events-none border-border-light text-text-secondary opacity-50'
            : 'border-border text-primary hover:bg-primary/10'
        }`}
      >
        التالي
      </Link>
    </nav>
  )
}
