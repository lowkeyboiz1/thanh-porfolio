'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export function Providers({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <NextThemesProvider {...props}>
      <ProgressBar height='4px' color='#123273' options={{ showSpinner: true }} shallowRouting />
      {children}
    </NextThemesProvider>
  )
}
