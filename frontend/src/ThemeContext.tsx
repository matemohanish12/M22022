import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme, darkTheme } from './theme'

const ThemeToggleContext = createContext({
  toggle: () => {},
  mode: 'light',
})

export const useThemeToggle = () => useContext(ThemeToggleContext)

export default function ThemeContext({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    try {
      const v = localStorage.getItem('bcm_theme')
      return (v === 'dark' ? 'dark' : 'light')
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('bcm_theme', mode)
    } catch {}
  }, [mode])

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))

  const value = useMemo(() => ({ toggle, mode }), [mode])

  return (
    <ThemeToggleContext.Provider value={value}>
      <MuiThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeToggleContext.Provider>
  )
}
