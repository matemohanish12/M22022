import React, { useEffect, useState } from 'react'
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'
import { getService } from '../api/services'
import { Container, Typography, Paper, Grid, Button, Alert } from '@mui/material'
import { useAuth } from '../AuthContext'

export default function ServiceDetails() {
  const { id } = useParams()
  const [service, setService] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  const canEdit = user?.role && ['BCM Administrator', 'Business Service Owner'].includes(user.role)
  const canDelete = user?.role === 'BCM Administrator'

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getService(id)
      .then((s) => setService(s))
      .catch(() => setService(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Container sx={{ mt: 2 }}>Loading...</Container>

  if (!service) return (
    <Container sx={{ mt: 2 }}>
      <Typography>Service not found.</Typography>
    </Container>
  )

  return (
    <Container sx={{ mt: 2 }}>
      <Button component={RouterLink} to="/services" variant="outlined" sx={{ mb: 2 }}>
        Back to Services
      </Button>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h5">{service.name}</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Description</Typography>
            <Typography>{service.description ?? '-'}</Typography>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>Category</Typography>
            <Typography>{service.category ?? '-'}</Typography>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>Owner</Typography>
            <Typography>{service.owner ?? '-'}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography>{service.status ?? '-'}</Typography>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>Criticality</Typography>
            <Typography>{service.criticality ?? '-'}</Typography>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>RTO / RPO</Typography>
            <Typography>{service.rto ?? '-'} / {service.rpo ?? '-'}</Typography>
          </Grid>
        </Grid>

        {!canEdit && !canDelete && (
          <Alert severity="info" sx={{ mt: 2 }}>
            You have view-only access to this service.
          </Alert>
        )}

        <Grid container spacing={1} sx={{ mt: 2 }}>
          {canEdit && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/services/${id}/edit`)}
              >
                Edit
              </Button>
            </Grid>
          )}
          {canDelete && (
            <Grid item>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  if (window.confirm('Delete this service?')) {
                    navigate('/services')
                  }
                }}
              >
                Delete
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  )
}
