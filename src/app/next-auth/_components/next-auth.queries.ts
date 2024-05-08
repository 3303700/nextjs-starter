import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'

import { useQueryCacheUpdater } from '@/hooks/use-react-query'

import { nextAuthActionGetSessionUserOrNull } from './next-auth.actions'
import type {
  NextAuthPartialSessionUser,
  NextAuthSessionUser,
} from './next-auth.types'

const queryKeyGetSessionUserOrNull = ['next-auth', 'session-user']

export function nextAuthPrefetchGetSessionUserOrNull(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: queryKeyGetSessionUserOrNull,
    queryFn: () => nextAuthActionGetSessionUserOrNull(),
  })
}

export function useNextAuthGetSessionUserOrNull() {
  return useQuery({
    queryKey: queryKeyGetSessionUserOrNull,
    queryFn: () => nextAuthActionGetSessionUserOrNull(),
    refetchOnMount: true,
  })
}

export function nextAuthGetCacheGetSessionUserOrNull(queryClient: QueryClient) {
  return queryClient.getQueryData<NextAuthSessionUser>(
    queryKeyGetSessionUserOrNull,
  )
}

export function useNextAuthCacheUpdater() {
  const queryClient = useQueryClient()

  const { setQueryData, updateItem } = useQueryCacheUpdater()

  function removeGetSessionUserOrNull() {
    queryClient.removeQueries({
      queryKey: queryKeyGetSessionUserOrNull,
    })
  }

  async function updateGetSessionUserOrNull(data: NextAuthPartialSessionUser) {
    await setQueryData(queryKeyGetSessionUserOrNull, updateItem(data))
  }

  return {
    removeGetSessionUserOrNull,
    updateGetSessionUserOrNull,
  }
}
