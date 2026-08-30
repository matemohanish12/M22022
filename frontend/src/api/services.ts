export type ServicePayload = {
  name: string
  description?: string
  category?: string
  owner?: string
  criticality?: number
  status?: string
  rto?: string
  rpo?: string
}

export async function listServices() {
  const res = await fetch('/api/services')
  if (!res.ok) throw new Error('Failed to fetch services')
  return res.json()
}

export async function getService(id: string) {
  const res = await fetch(`/api/services/${id}`)
  if (!res.ok) throw new Error('Failed to fetch service')
  return res.json()
}

export async function createService(payload: ServicePayload) {
  const res = await fetch('/api/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to create service')
  }
  return res.json()
}
