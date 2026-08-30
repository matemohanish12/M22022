import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Typography,
  Alert,
} from '@mui/material'
import { createService } from '../api/services'

export default function ServiceCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    owner: '',
    criticality: 3,
    status: 'active',
    rto: '',
    rpo: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      // Ensure service_id exists — backend validation requires it
      const payload = { ...form, service_id: (crypto as any).randomUUID ? (crypto as any).randomUUID() : Date.now().toString() }
      await createService(payload as any)
      navigate('/services')
    } catch (err: any) {
      setError(err.message || 'Failed to create')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>Create Service</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Name" value={form.name} required onChange={(e) => handleChange('name', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Owner" value={form.owner} onChange={(e) => handleChange('owner', e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Category" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField type="number" fullWidth label="Criticality" value={form.criticality} onChange={(e) => handleChange('criticality', Number(e.target.value))} inputProps={{ min: 1, max: 5 }} />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField select fullWidth label="Status" value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField fullWidth label="RTO" value={form.rto} onChange={(e) => handleChange('rto', e.target.value)} />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField fullWidth label="RPO" value={form.rpo} onChange={(e) => handleChange('rpo', e.target.value)} />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button type="submit" variant="contained" disabled={saving}>Create</Button>
              <Button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate('/services')}>Cancel</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}
