'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { PAGE_AUTH_SIGN_IN, SEARCH_PARAM_CALLBACK_URL } from '@/lib/constants'
import { utilCheckSubpath, utilExtractIdFromPath } from '@/lib/utils-vanilla'

export function useMySearchParams() {
  const searchParams = useSearchParams()

  const isParamMatch = useCallback(
    (paramName: string, paramValue: string) =>
      searchParams.get(paramName) === paramValue,
    [searchParams],
  )

  const urlSearchParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  )

  const searchParamsObj = useMemo(
    () => Object.fromEntries(urlSearchParams),
    [urlSearchParams],
  )

  const setQueryString = useCallback(
    (name: string, value: string | number) => {
      urlSearchParams.set(
        name,
        typeof value === 'string' ? value : value.toString(),
      )

      return urlSearchParams
    },
    [urlSearchParams],
  )

  const appendQueryString = useCallback(
    (name: string, value: string | number) => {
      urlSearchParams.append(
        name,
        typeof value === 'string' ? value : value.toString(),
      )

      return urlSearchParams
    },
    [urlSearchParams],
  )

  const deleteQueryString = useCallback(
    (name: string) => {
      urlSearchParams.delete(name)

      return urlSearchParams
    },
    [urlSearchParams],
  )

  return {
    searchParams,
    urlSearchParams,
    searchParamsObj,
    isParamMatch,
    setQueryString,
    appendQueryString,
    deleteQueryString,
  }
}

export function useMyPathname() {
  const pathname = usePathname()

  const isPathMatch = useCallback(
    (path: string) => path === pathname,
    [pathname],
  )

  const isNestedPath = useCallback(
    (parentPath: string) => utilCheckSubpath(pathname, parentPath),
    [pathname],
  )

  const getPathId = useCallback(
    (parentPath: string) => utilExtractIdFromPath(pathname, parentPath),
    [pathname],
  )

  return {
    pathname,
    isPathMatch,
    isNestedPath,
    getPathId,
  }
}

export function useUrl() {
  const pathname = usePathname()

  const searchParams = useSearchParams()

  const authSigninWithCallbackUrl = useMemo(
    () =>
      pathname !== PAGE_AUTH_SIGN_IN
        ? (`${PAGE_AUTH_SIGN_IN}?${SEARCH_PARAM_CALLBACK_URL}=${pathname + '?' + encodeURIComponent(searchParams.toString())}` as const)
        : '',
    [pathname, searchParams],
  )

  return {
    authSigninWithCallbackUrl,
  }
}

export function useMyRouter() {
  const router = useRouter()

  const { authSigninWithCallbackUrl } = useUrl()

  const pushAuthSigninWithCallback = useCallback(() => {
    if (authSigninWithCallbackUrl) {
      router.push(authSigninWithCallbackUrl)
    }
  }, [authSigninWithCallbackUrl, router])

  return {
    router,
    pushAuthSigninWithCallback,
  }
}
