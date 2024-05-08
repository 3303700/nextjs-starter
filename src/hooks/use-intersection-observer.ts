'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export function useInfiniteScroll<T>({
  hasNextPage,
  fetchNextPage,
  isLoading = false, // Add optional isLoading state for loading indicator
  threshold = 0.5, // Adjust threshold for inView trigger (default 0.5)
  disabled = false, // Allow disabling infinite scroll
}: {
  hasNextPage: boolean
  fetchNextPage: (...args: T[]) => Promise<unknown>
  isLoading?: boolean // Optional loading state
  threshold?: number // Threshold for inView trigger
  disabled?: boolean // Disable infinite scroll
} & React.PropsWithChildren) {
  const [ref, inView] = useInView({ threshold })

  const [isFetching, setIsFetching] = useState(isLoading || disabled) // Handle initial loading and disabled state

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && !disabled) {
      setIsFetching(true)

      fetchNextPage().finally(() => setIsFetching(false))
    }
  }, [inView, hasNextPage, fetchNextPage, isFetching, disabled])

  return {
    ref,
    isLoading, // Expose isLoading state for loading indicator
  }
}

export function useInfiniteScrollLegacy<T>({
  hasNextPage,
  fetchNextPage,
}: {
  hasNextPage: boolean
  fetchNextPage: (...args: T[]) => Promise<unknown>
} & React.PropsWithChildren) {
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return {
    ref,
  }
}
