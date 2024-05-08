'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function useMyNextTheme() {
  const [loadedTheme, setLoadedTheme] = useState<string | null>(null)

  const [themeLoading, setThemeLoading] = useState(true)

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setThemeLoading(true)
    if (theme) {
      setLoadedTheme(theme)
      setThemeLoading(false)
    }
  }, [theme, themeLoading])

  return {
    loadedTheme,
    themeLoading,
    setTheme,
  }
}
