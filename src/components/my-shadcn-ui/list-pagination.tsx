'use client'

import { useMyPathname, useMySearchParams } from '@/hooks/use-next'
import { cn, type PropsWithClassName } from '@/lib/utils'
import type { OffsetPaginationMetadata } from '@/lib/utils-vanilla'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from './pagination'

export default function ListPagination({
  paginationMetadata: { page, totalPage, hasPrev, hasNext },
  pageRange = 3,
  pageSearchParamName = 'page',
  className,
}: PropsWithClassName<{
  paginationMetadata: OffsetPaginationMetadata
  pageRange?: 1 | 3 | 5
  pageSearchParamName?: string
}>) {
  if (totalPage === 0 || page > totalPage) {
    return null
  }

  const mappedPageNums = Array.from(
    { length: 2 * pageRange + 1 },
    (_, index) => page - pageRange + index,
  )
    .filter(
      pageNum =>
        pageNum >= 1 &&
        pageNum <= totalPage &&
        pageNum !== 1 &&
        pageNum !== totalPage,
    )
    .map(pageNum => (
      <PaginationLinkItem
        pageSearchParamName={pageSearchParamName}
        key={pageNum}
        disabled={pageNum === page}
        isActive={pageNum === page}
        pageNum={pageNum}
      >
        {pageNum}
      </PaginationLinkItem>
    ))

  return (
    <Pagination className={cn(className && className)}>
      <PaginationContent className=''>
        {hasPrev && (
          <PaginationLinkItem
            pageSearchParamName={pageSearchParamName}
            isActive={false}
            disabled={false}
            pageNum={Math.max(page - 5, 1)}
          >
            -{Math.min(5, page - 1)}
          </PaginationLinkItem>
        )}
        {totalPage > 0 && (
          <PaginationLinkItem
            pageSearchParamName={pageSearchParamName}
            isActive={page === 1}
            disabled={page === 1}
            pageNum={1}
          >
            1
          </PaginationLinkItem>
        )}
        {page > pageRange + 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {mappedPageNums}
        {totalPage - page > pageRange + 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {totalPage > 1 && (
          <PaginationLinkItem
            pageSearchParamName={pageSearchParamName}
            disabled={!hasNext}
            isActive={page === totalPage}
            pageNum={totalPage}
          >
            {totalPage}
          </PaginationLinkItem>
        )}
        {hasNext && (
          <PaginationLinkItem
            pageSearchParamName={pageSearchParamName}
            isActive={false}
            disabled={false}
            pageNum={Math.min(page + 5, totalPage)}
          >
            +{Math.min(5, totalPage - page)}
          </PaginationLinkItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

function PaginationLinkItem({
  pageSearchParamName,
  children,
  pageNum,
  isActive,
  disabled,
}: React.PropsWithChildren<{
  pageSearchParamName: string
  pageNum: number
  isActive: boolean
  disabled: boolean
}>) {
  const { pathname } = useMyPathname()
  const { setQueryString } = useMySearchParams()

  return (
    <PaginationItem>
      <PaginationLink
        aria-current={isActive ? 'page' : undefined}
        aria-label={`Go to page ${pageNum}`}
        href={{
          pathname,
          query: setQueryString(pageSearchParamName, pageNum).toString(),
        }}
        isActive={isActive}
        className={cn(disabled && 'pointer-events-none')}
      >
        {children}
      </PaginationLink>
    </PaginationItem>
  )
}
