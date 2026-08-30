import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useThemeToggle } from '../ThemeContext'
import { useAuth } from '../AuthContext'

export default function Header() {
  const { toggle, mode } = useThemeToggle()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
          BCM Platform
        </Typography>

        <RouterLink to="/services" style={{ color: 'inherit', textDecoration: 'none', marginRight: 16 }}>
          Services
        </RouterLink>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <Typography variant="body2" sx={{ color: 'inherit' }}>
              {user.name} ({user.role})
            </Typography>
          )}

          <IconButton color="inherit" onClick={toggle} aria-label="Toggle theme" sx={{ mr: 1 }}>
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>

          {user && (
            <Button color="inherit" onClick={handleLogout} variant="outlined" size="small">
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
