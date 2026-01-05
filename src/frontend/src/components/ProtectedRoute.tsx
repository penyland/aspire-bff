import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="loading-skeleton" role="status" aria-live="polite">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="skeleton-row" aria-hidden="true" />
        ))}
        <span className="visually-hidden">Checking authentication...</span>
      </div>
    )
  }

  if (!user?.isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname)
    return <Navigate to={`/bff/login?redirectUrl=${returnUrl}`} replace />
  }

  return <>{children}</>
}
