import { useState } from 'react'

interface Identity {
  isAuthenticated: boolean
  name: string
}

interface SessionData {
  identity: Identity
}

function Bff() {
  const [response, setResponse] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    // get return url to redirect after login
    const returnUrl = encodeURIComponent(window.location.pathname);
    window.location.href = `/bff/login?redirectUrl=${returnUrl}`;
  }

  const handleLogout = async () => {
    const returnUrl = encodeURIComponent(window.location.pathname);
    window.location.href = `/bff/logout?redirectUrl=${returnUrl}`;
  }

  const handleSession = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/bff/session',
        {
          method: 'POST'
        })

      if (!res.ok) {
        setResponse('')
        setUserName('')
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data: SessionData = await res.json()
      setResponse(JSON.stringify(data, null, 2))
      setUserName(data.identity.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to call /bff/session')
      console.error('Error calling /bff/session:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="weather-section" aria-labelledby="weather-heading">
      <div className="card">
        <div className="section-header">
          <h2 id="weather-heading" className="section-title">
            {!userName ? 'Authentication' : `Hello, ${userName}!`}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            className="refresh-button"
            onClick={handleLogin}
            disabled={loading}
            type="button"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

          <button
            className="refresh-button"
            onClick={handleSession}
            disabled={loading}
            type="button"
          >Get session</button>

          <button
            className="refresh-button"
            onClick={handleLogout}
            disabled={loading}
            type="button"
          >Logout</button>
          <button
            className="refresh-button"
            onClick={handleLogout}
            disabled={loading}
            type="button">Call local api</button>
          <button
            className="refresh-button"
            onClick={handleLogout}
            disabled={loading}
            type="button">Call remote api</button>
        </div>

        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            <span>{error}</span>
          </div>
        )}

        {response && (
          <div className="section-header" style={{ marginTop: '1rem' }}>
            <div style={{ width: '100%', padding: '1rem', background: 'rgba(124, 146, 245, 0.1)', borderRadius: '0.5rem', wordBreak: 'break-word' }}>
              <strong>Response:</strong>
              <pre style={{ margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap' }}>{response}</pre>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Bff