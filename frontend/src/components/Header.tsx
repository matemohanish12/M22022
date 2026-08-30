import React from 'react'
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { Link as RouterLink } from 'react-router-dom'
import { useThemeToggle } from '../ThemeContext'

export default function Header() {
  const { toggle, mode } = useThemeToggle()
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
          BCM Platform
        </Typography>

        <RouterLink to="/services" style={{ color: 'inherit', textDecoration: 'none', marginRight: 16 }}>
          Services
        </RouterLink>

        <IconButton color="inherit" onClick={toggle} aria-label="Toggle theme">
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
