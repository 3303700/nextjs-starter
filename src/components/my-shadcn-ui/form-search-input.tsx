'use client'

import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useMemo, useState } from 'react'

import { useMySearchParams } from '@/hooks/use-next'
import useMyProgressBarRouter from '@/hooks/use-progress-router'

import { Input } from './input'

export default function FormSearchInput({
  searchPage,
  paramName = 'q',
  placeholder = 'Type to search...',
  useScrollTop = true,
  useSoftSearch = false,
}: {
  searchPage: string
  paramName?: string
  placeholder?: string
  useScrollTop?: boolean
  useSoftSearch?: boolean
}) {
  const [text, setText] = useState('')

  const { setQueryString } = useMySearchParams()

  const { router } = useMyProgressBarRouter()

  const searchUrl = useMemo(() => {
    return useSoftSearch
      ? `${searchPage}?${setQueryString(paramName, text).toString()}`
      : `${searchPage}?${paramName}=${encodeURIComponent(text)}`
  }, [text, searchPage, useSoftSearch, paramName, setQueryString])

  return (
    <form
      className='w-full'
      action={async () => {
        if (window && useScrollTop) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }

        if (text && text.trim().length === 0) {
          return
        }

        router.push(searchUrl)
      }}
    >
      <div className='relative rounded-md shadow-sm'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <MagnifyingGlassIcon
            className='h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </div>

        <Input
          name='search'
          value={text}
          placeholder={placeholder}
          onChange={e => setText(e.target.value)}
          className='pl-10 placeholder:text-black dark:placeholder:text-white'
        />
      </div>
    </form>
  )
}
