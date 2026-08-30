import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Role = 'BCM Administrator' | 'Business Service Owner' | 'Risk Manager' | 'Recovery Team Member' | 'Department Head' | 'Auditor' | 'Executive Management' | 'Guest'

type User = { name: string; role: Role }

const AuthContext = createContext({
  user: null as User | null,
  login: (u: User) => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('bcm_user')
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) localStorage.setItem('bcm_user', JSON.stringify(user))
      else localStorage.removeItem('bcm_user')
    } catch {}
  }, [user])

  const login = (u: User) => setUser(u)
  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
