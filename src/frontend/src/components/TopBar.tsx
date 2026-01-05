import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function TopBar() {
  const { user, loading } = useAuth()

  const handleLogin = () => {
    const returnUrl = encodeURIComponent(window.location.pathname)
    window.location.href = `/bff/login?redirectUrl=${returnUrl}`
  }

  const handleLogout = () => {
    const returnUrl = encodeURIComponent('/')
    window.location.href = `/bff/logout?redirectUrl=${returnUrl}`
  }

  return (
    <div style={{
      padding: '0.75rem 1rem',
      background: 'linear-gradient(135deg, rgba(124, 146, 245, 0.15) 0%, rgba(124, 146, 245, 0.05) 100%)',
      borderBottom: '1px solid rgba(124, 146, 245, 0.2)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} aria-label="Main navigation">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.95rem', fontWeight: 500 }}>Home</Link>
        <Link to="/bff" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.95rem', fontWeight: 500 }}>Bff</Link>
        <Link to="/protected" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.95rem', fontWeight: 500 }}>Protected</Link>
        <Link to="/weather" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.95rem', fontWeight: 500 }}>Weather</Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!loading && (
          <>
            {user?.isAuthenticated ? (
              <>
                <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                  Signed in as <strong>{user.name}</strong>
                </span>
                <button
                  className="refresh-button"
                  onClick={handleLogout}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="refresh-button"
                onClick={handleLogin}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
              >
                Login
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
