export type PropsWithStringPathParams<P = unknown> = P & {
  params: {
    [key: string]: string
  }
}

export type PropsWithStringArrayPathParams<P = unknown> = P & {
  params: {
    [key: string]: string[]
  }
}

export type SearchParams = {
  [key: string]: string | string[] | undefined
}

export type PropsWithSearchParams<P = unknown> = P & {
  searchParams: SearchParams
}

export function utilConvertSearchParamsToURLSearchParams(
  searchParams: SearchParams,
): URLSearchParams {
  const params = new URLSearchParams()

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(string => params.append(key, string))
    } else if (value) {
      params.append(key, value)
    }
  })

  return params
}

export function utilConvertObjectToURLSearchParams<
  T extends Record<string, any>,
>(obj: T): URLSearchParams {
  const urlSearchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      const valueString = Array.isArray(value)
        ? value.join(',')
        : value.toString()

      urlSearchParams.append(key, valueString)
    }
  }

  return urlSearchParams
}

export function utilConvertFormDataToObject(formData: FormData): {
  [k: string]: FormDataEntryValue
} {
  return Object.fromEntries(formData.entries())
}

export function utilSleep(ms: number = 1000): Promise<void> {
  return new Promise(resolve => {
    const timeoutId = setTimeout(resolve, ms)

    return () => clearTimeout(timeoutId)
  })
}

export function utilCheckEmptyObject<T extends object>(
  obj: T | null | undefined,
): boolean {
  return obj === null || obj === undefined || Object.keys(obj).length === 0
}

export function utilRemoveKeyFromObject<T extends object, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> {
  const { [key]: _, ...rest } = obj

  return rest
}

export function utilRemoveMultipleKeysFromObject<
  T extends object,
  K extends keyof T,
>(obj: T, ...keys: K[]): Omit<T, K> {
  const result: Partial<T> = { ...obj }

  keys.forEach(key => {
    delete result[key]
  })

  return result as Omit<T, K>
}

export function utilUpdateRowByNewRow<
  T extends K,
  K extends { id: string | number },
>(arr: T[], updatedItem: K): T[] {
  return arr.map(item =>
    item.id === updatedItem.id
      ? {
          ...item,
          ...updatedItem,
        }
      : item,
  )
}

export function utilUpdateMultipleRowsByNewRows<
  T extends K,
  K extends { id: string | number },
>(arr: T[], updatedItems: K[]): T[] {
  const updatedMap = new Map(
    updatedItems.map(item => [item.id, { ...item } as const]),
  )

  return arr.map(item => {
    const updatedItem = updatedMap.get(item.id)
    return updatedItem ? { ...item, ...updatedItem } : item
  })
}

export function utilDeleteRowById<T extends { id: string | number }>(
  arr: T[],
  id: string | number,
): T[] {
  return arr.filter(item => item.id !== id)
}

export function utilDeleteMultipleRowsByIds<T extends { id: string | number }>(
  arr: T[],
  ids: (string | number)[],
): T[] {
  return arr.filter(item => !ids.some(id => id === item.id))
}

function normalizePath(path: string) {
  // Normalize paths (remove trailing slashes)
  return path.replace(/\/$/, '')
}

export function utilCheckSubpath(path: string, parentPath: string): boolean {
  path = normalizePath(path)
  parentPath = normalizePath(parentPath)

  return path && parentPath && path.startsWith(parentPath) ? true : false
}

export function utilExtractIdFromPath(
  path: string,
  basePath: string,
): string | undefined {
  // Normalize paths (remove trailing slashes)
  path = normalizePath(path)
  basePath = normalizePath(basePath)

  // Check if path starts with basePath
  if (!path.startsWith(basePath)) {
    return undefined // Not a subpath
  }

  // Extract remaining part after basePath
  const remainingPath = path.slice(basePath.length).replace(/^\//, '')

  // Check if remainingPath is empty
  if (remainingPath === '') {
    return undefined // No ID present
  }

  // Return the remaining path as the ID
  return remainingPath
}

export function utilExtractMultipleIdsFromPath(
  path: string,
  basePath: string,
): string[] | undefined {
  // Normalize paths (remove trailing slashes)
  path = normalizePath(path)
  basePath = normalizePath(basePath)

  // Check if path starts with basePath
  if (!path.startsWith(basePath)) {
    return undefined // Not a subpath
  }

  // Extract remaining part after basePath
  const remainingPath = path.slice(basePath.length)

  // Split remainingPath by separator (e.g., '/')
  // Consider potential empty elements due to trailing slashes
  const potentialIds = remainingPath.split('/').filter(id => id)

  // If no IDs found after splitting, return undefined
  if (!potentialIds.length) {
    return undefined // No IDs present
  }

  return potentialIds
}

export function utilFilterString<T extends string>({
  value,
  defaultValue,
  uppercase,
  filter,
}: {
  value: string | null | undefined
  filter?: readonly T[]
  defaultValue?: T | undefined
  uppercase?: boolean
}): T | undefined {
  if (value === null || value === undefined) {
    return defaultValue
  }

  let stringValue = value as string

  if (uppercase) {
    stringValue = stringValue.toUpperCase()
  }

  return filter && !filter.includes(stringValue as T)
    ? defaultValue
    : (stringValue as T)
}

export function utilFilterStringByFunction<T extends string>({
  value,
  defaultValue,
  uppercase,
  filter,
}: {
  value: string | null | undefined
  defaultValue: T | undefined
  uppercase?: boolean
  filter: (value: string) => boolean
}): T | undefined {
  if (value === null || value === undefined) {
    return defaultValue
  }

  let stringValue = value as string

  if (uppercase) {
    stringValue = stringValue.toUpperCase()
  }

  if (!filter(stringValue)) {
    return defaultValue
  }

  return stringValue as T
}

export function utilFilterNumber<T extends number>({
  value,
  defaultValue,
  isInteger,
  largerThan,
  belowThan,
  includes,
  excludes,
}: {
  value: string | null | undefined
  defaultValue: T | undefined
  isInteger?: boolean
  largerThan?: number
  belowThan?: number
  includes?: readonly number[]
  excludes?: readonly number[]
}): T | undefined {
  if (!value || Number.isNaN(Number(value))) {
    return defaultValue
  }

  const parsedNumber = Number(value)

  if (isInteger && !Number.isInteger(parsedNumber)) {
    return defaultValue
  }

  if (includes && !includes.includes(parsedNumber)) {
    return defaultValue
  }

  if (excludes && excludes.includes(parsedNumber)) {
    return defaultValue
  }

  if (largerThan && parsedNumber <= largerThan) {
    return defaultValue
  }

  if (belowThan && parsedNumber >= belowThan) {
    return defaultValue
  }

  return parsedNumber as T
}

export function utilParseNumber(
  value: string | number | null | undefined,
  options?: {
    isInteger?: boolean
    isPositive?: boolean
  },
): number | null {
  if (value === null || value === undefined) {
    return null
  }

  const parsedValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(parsedValue)) {
    return null
  } else if (options?.isInteger && !Number.isInteger(parsedValue)) {
    return null
  } else if (options?.isPositive && parsedValue <= 0) {
    return null
  }

  return parsedValue
}

export function utilParseDate({
  value,
}: {
  value: string | null | undefined
}): Date | null {
  if (value === null || value === undefined) {
    return null
  }

  try {
    const parsedDate = new Date(value)

    return isNaN(parsedDate.getTime()) ? null : (parsedDate as Date)
  } catch (error) {
    return null
  }
}

export type ListOrderingArray<T, U> = {
  param: string
  orderBy: T
  label: U
}[]

export type CursorPaginationParams<P = unknown, T = unknown> = P & {
  cursor?: T
  limit?: number
}

export type CursorPaginatedDataWithNextCursor<T, U> = {
  data: T[]
  nextCursor: U | undefined
}

export type OffsetPaginationParams<P = unknown> = P & {
  page: number | undefined
  limit?: number
}

export type OffsetPaginatedDataWithMetadata<T> = {
  data: T[]
  metaData: OffsetPaginationMetadata
}

export type OffsetPaginationMetadata = {
  count: number
  page: number
  limit: number
  totalPage: number
  hasPrev: boolean
  hasNext: boolean
  startPage: number
  endPage: number
  prevPage: number | null
  nextPage: number | null
}

export function utilGenerateOffsetPaginationMetadata({
  total,
  page,
  pageSize,
}: {
  total: number
  page: number
  pageSize: number
}): OffsetPaginationMetadata {
  const totalPage = Math.ceil(total / pageSize)

  return {
    count: total,
    page,
    limit: pageSize,
    totalPage,
    hasPrev: page > 1,
    hasNext: page < totalPage,
    startPage: Math.max(1, page - 2),
    endPage: Math.min(totalPage, page + 2),
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPage ? page + 1 : null,
  }
}

export type ServerActionResponse<T = undefined> = {
  data?: T
  errors?: {
    [key: string]: {
      message: string
    }
  }
}

export function utilHandleErrorOnServerAction({
  error,
  errorMeesage,
  useFallback = false,
}: {
  error: unknown
  errorMeesage?: string
  useFallback?: boolean
}): ServerActionResponse<any> {
  const fallbackMessage = 'Something unexpected went wrong...'

  if (errorMeesage) {
    return {
      errors: {
        error: {
          message: errorMeesage,
        },
      },
    }
  } else {
    return {
      errors: {
        error: {
          message: useFallback
            ? fallbackMessage
            : error instanceof Error
              ? error.message
              : fallbackMessage,
        },
      },
    }
  }
}

export function utilEllipsizeText({
  text,
  maxLength = 6,
  ellipsis = '...',
}: {
  text: string | undefined | null
  maxLength?: number
  ellipsis?: string
}) {
  if (!text) {
    return ''
  } else if (text.length < maxLength) {
    return text
  } else {
    return `${text.substring(0, maxLength)}${ellipsis}`
  }
}

export function utilToKFormat(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  } else {
    return num.toString()
  }
}

export function utilDateToLocalDateString({
  input,
  locals = 'en-US',
  options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  },
}: {
  input: Date | string | number
  locals?: Intl.LocalesArgument
  options?: Intl.DateTimeFormatOptions
}): string {
  const date = new Date(input)
  return date.toLocaleDateString(locals, options)
}

export const utilDateTimeFormatter = (
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions | undefined,
) => new Intl.DateTimeFormat(locales, options)

export const utilNumberFormatter = (
  locales?: Intl.LocalesArgument,
  options?: Intl.NumberFormatOptions | undefined,
) => new Intl.NumberFormat(locales || 'en-US', options)

export const utilCurrencyFormatter = (
  locales?: Intl.LocalesArgument,
  options?: Intl.NumberFormatOptions | undefined,
) =>
  new Intl.NumberFormat(
    locales || 'en-US',
    options || {
      currency: 'USD',
      style: 'currency',
      minimumFractionDigits: 0,
    },
  )
