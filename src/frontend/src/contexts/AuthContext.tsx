import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Claim = {
  type: string
  value: string
}

type UserInfo = {
  isAuthenticated: boolean
  name: string
  claims: Claim[]
}

type AuthContextType = {
  user: UserInfo | null
  loading: boolean
  error: string | null
  checkAuth: (options?: { silent?: boolean }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAuth = async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true
    if (!silent) {
      setLoading(true)
      setError(null)
    }

    try {
      const res = await fetch('/bff/user', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-store'
        }
      })

      if (res.status === 401) {
        setUser(null)
        return
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data: UserInfo = await res.json()
      setUser(data.isAuthenticated ? data : null)
    } catch (err) {
      setUser(null)
      if (!silent) {
        setError(err instanceof Error ? err.message : 'Unable to verify authentication')
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const logout = () => {
    const returnUrl = encodeURIComponent('/')
    window.location.href = `/bff/logout?redirectUrl=${returnUrl}`
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Refresh auth when returning to the tab or periodically to detect expired cookies
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth({ silent: true })
      }
    }

    const handleFocus = () => {
      checkAuth({ silent: true })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    const intervalId = window.setInterval(() => {
      checkAuth({ silent: true })
    }, 2 * 60 * 1000)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
