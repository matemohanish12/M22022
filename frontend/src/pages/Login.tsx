import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Paper, TextField, Button, MenuItem, Typography } from '@mui/material'
import AuthProvider, { useAuth } from '../AuthContext'

const roles = [
  'BCM Administrator',
  'Business Service Owner',
  'Risk Manager',
  'Recovery Team Member',
  'Department Head',
  'Auditor',
  'Executive Management',
  'Guest',
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [role, setRole] = useState(roles[7])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ name: name || 'Demo User', role: role as any })
    navigate('/')
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Login (mock)</Typography>
        <form onSubmit={submit}>
          <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2 }} />
          <TextField select fullWidth label="Role" value={role} onChange={(e) => setRole(e.target.value)} sx={{ mt: 2 }}>
            {roles.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>
        </form>
      </Paper>
    </Container>
  )
}
