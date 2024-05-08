import MyNextThemeProvider from './next-theme-provider'
import { MyProgressBarProvider } from './progress-bar-provider'
import MyQueryClientProvider from './query-client-providers'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MyQueryClientProvider>
      <MyNextThemeProvider>
        <MyProgressBarProvider>{children}</MyProgressBarProvider>
      </MyNextThemeProvider>
    </MyQueryClientProvider>
  )
}
