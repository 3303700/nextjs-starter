'use client'

import {
  useQueryClient,
  type InfiniteData,
  type Updater,
} from '@tanstack/react-query'

import {
  utilDeleteMultipleRowsByIds,
  utilDeleteRowById,
  utilUpdateMultipleRowsByNewRows,
  utilUpdateRowByNewRow,
  type CursorPaginatedDataWithNextCursor,
  type OffsetPaginatedDataWithMetadata,
} from '@/lib/utils-vanilla'

export function useQueryCacheUpdater() {
  const queryClient = useQueryClient()

  function updateItem<T>(
    updatedItem: Partial<T>,
  ): Updater<T | undefined, T | undefined> {
    return data => {
      if (!data) {
        return undefined
      }

      const updatedData: T = {
        ...data,
        ...updatedItem,
      }

      return updatedData
    }
  }

  function updateListItem<
    T extends U,
    U extends { id: string | number },
    K extends
      | OffsetPaginatedDataWithMetadata<T>
      | CursorPaginatedDataWithNextCursor<T, unknown>,
  >(updatedItem: U & Partial<T>): Updater<K | undefined, K | undefined> {
    return data => {
      if (!data) {
        return undefined
      }

      const updatedData: K = {
        ...data,
        data: utilUpdateRowByNewRow(data.data, updatedItem),
      }

      return updatedData
    }
  }

  function updateListItems<
    T extends U,
    U extends { id: string | number },
    K extends
      | OffsetPaginatedDataWithMetadata<T>
      | CursorPaginatedDataWithNextCursor<T, unknown>,
  >(updatedItems: (U & Partial<T>)[]): Updater<K | undefined, K | undefined> {
    return data => {
      if (!data) {
        return undefined
      }

      const updatedData: K = {
        ...data,
        data: utilUpdateMultipleRowsByNewRows(data.data, updatedItems),
      }

      return updatedData
    }
  }

  function removeListItem<
    T extends U,
    U extends { id: string | number },
    K extends
      | OffsetPaginatedDataWithMetadata<T>
      | CursorPaginatedDataWithNextCursor<T, unknown>,
  >(id: string | number): Updater<K | undefined, K | undefined> {
    return data => {
      if (!data) {
        return undefined
      }

      const updatedData: K = {
        ...data,
        data: utilDeleteRowById(data.data, id),
      }

      return updatedData
    }
  }

  function removeListItems<
    T extends U,
    U extends { id: string | number },
    K extends
      | OffsetPaginatedDataWithMetadata<T>
      | CursorPaginatedDataWithNextCursor<T, unknown>,
  >(ids: (string | number)[]): Updater<K | undefined, K | undefined> {
    return data => {
      if (!data) {
        return undefined
      }

      const updatedData: K = {
        ...data,
        data: utilDeleteMultipleRowsByIds(data.data, ids),
      }

      return updatedData
    }
  }

  function unshiftInfiniteData<
    T extends U,
    U extends { id: string | number },
    K extends InfiniteData<
      | CursorPaginatedDataWithNextCursor<T, unknown>
      | OffsetPaginatedDataWithMetadata<T>
    >,
  >(newItem: T): Updater<K | undefined, K | undefined> {
    return data => {
      if (!data) {
        return undefined
      }

      const updatedData: K = {
        ...data,
        pages: [
          {
            ...data.pages[0],
            data: [newItem, ...data.pages[0].data],
          },
          ...data.pages.slice(1),
        ],
      }

      return updatedData
    }
  }

  function updateInfiniteDataItem<
    T extends U,
    U extends { id: string | number },
    K extends InfiniteData<
      | CursorPaginatedDataWithNextCursor<T, unknown>
      | OffsetPaginatedDataWithMetadata<T>
    >,
  >(updatedItem: U & Partial<T>): Updater<K | undefined, K | undefined> {
    return data => {
      if (!data) {
        return undefined
      }

      const updatedData: K = {
        ...data,
        pages: data.pages.map(page => {
          return {
            ...page,
            page: utilUpdateRowByNewRow(page.data, updatedItem),
          }
        }),
      }

      return updatedData
    }
  }

  function updateInfiniteDataItems<
    T extends U,
    U extends { id: string | number },
    K extends InfiniteData<
      | CursorPaginatedDataWithNextCursor<T, unknown>
      | OffsetPaginatedDataWithMetadata<T>
    >,
  >(updatedItems: (U & Partial<T>)[]): Updater<K | undefined, K | undefined> {
    return data => {
      if (!data || !data.pages) {
        return undefined
      }

      const newData: K = {
        ...data,
        pages: data.pages.map(page => {
          const data = page.data

          return {
            ...page,
            data: utilUpdateMultipleRowsByNewRows(data, updatedItems),
          }
        }),
      }

      return newData
    }
  }

  function removeInfiniteDataItem<
    T extends U,
    U extends { id: string | number },
    K extends InfiniteData<
      | CursorPaginatedDataWithNextCursor<T, unknown>
      | OffsetPaginatedDataWithMetadata<T>
    >,
  >(id: string | number): Updater<K | undefined, K | undefined> {
    return data => {
      if (!data || !data.pages) {
        return undefined
      }

      const newData: K = {
        ...data,
        pages: data.pages.map(page => {
          const data = page.data

          return {
            ...page,
            data: utilDeleteRowById(data, id),
          }
        }),
      }

      return newData
    }
  }

  function removeInfiniteDataItems<
    T extends U,
    U extends { id: string | number },
    K extends InfiniteData<
      | CursorPaginatedDataWithNextCursor<T, unknown>
      | OffsetPaginatedDataWithMetadata<T>
    >,
  >(ids: (string | number)[]): Updater<K | undefined, K | undefined> {
    return data => {
      if (!data || !data.pages) {
        return undefined
      }

      const newData: K = {
        ...data,
        pages: data.pages.map(page => {
          const data = page.data

          return {
            ...page,
            data: utilDeleteMultipleRowsByIds(data, ids),
          }
        }),
      }

      return newData
    }
  }

  async function setQueryData<T, K>(
    queryKey: K[],
    updater: Updater<T | undefined, T | undefined>,
  ) {
    return await queryClient.setQueryData<T>(queryKey, updater)
  }

  return {
    updateItem,
    updateListItem,
    updateListItems,
    removeListItem,
    removeListItems,
    unshiftInfiniteData,
    updateInfiniteDataItem,
    updateInfiniteDataItems,
    removeInfiniteDataItem,
    removeInfiniteDataItems,
    setQueryData,
  }
}
