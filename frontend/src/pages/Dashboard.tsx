import React, { useEffect, useState } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
} from '@mui/material'

type Service = {
  id: string
  name?: string
  criticality?: number
}

type Risk = {
  id: string
  title?: string
  likelihood?: string
  impact?: string
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [risks, setRisks] = useState<Risk[]>([])
  const [recoveryPlansCount, setRecoveryPlansCount] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/services').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/risks').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/recovery-plans').then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([sData, rData, rpData]) => {
        setServices(Array.isArray(sData) ? sData : [])
        setRisks(Array.isArray(rData) ? rData : [])
        setRecoveryPlansCount(Array.isArray(rpData) ? rpData.length : 0)
      })
      .catch(() => {
        setServices([])
        setRisks([])
        setRecoveryPlansCount(0)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalServices = services.length
  const criticalServices = services.filter((s) => (s.criticality ?? 0) >= 4).length
  const highRisks = risks.length
  const topCritical = services
    .slice()
    .sort((a, b) => (b.criticality ?? 0) - (a.criticality ?? 0))
    .slice(0, 5)

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        BCM Dashboard
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Total Services</Typography>
                  <Typography variant="h5">{totalServices}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Critical Services (≥ 4)</Typography>
                  <Typography variant="h5">{criticalServices}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">High Risks</Typography>
                  <Typography variant="h5">{highRisks}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Recovery Plans</Typography>
                  <Typography variant="h5">{recoveryPlansCount ?? '-'}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Critical Services
            </Typography>
            {topCritical.length === 0 ? (
              <Typography>No critical services found.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Criticality</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topCritical.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name ?? s.id}</TableCell>
                      <TableCell>
                        <Chip label={s.criticality ?? '-'} color={(s.criticality ?? 0) >= 4 ? 'error' : 'default'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </>
      )}
    </Container>
  )
}
