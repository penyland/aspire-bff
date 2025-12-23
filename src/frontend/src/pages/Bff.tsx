import { useState } from 'react'

function Bff() {
  const [response, setResponse] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/bff/login')

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.text()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to call /bff/login')
      console.error('Error calling /bff/login:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    throw new Error('Function not implemented.')
  }

  return (
    <section className="weather-section" aria-labelledby="weather-heading">
      <div className="card">
        <div className="section-header">
          <h2 id="weather-heading" className="section-title">Authentication</h2>
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
            onClick={handleLogout}
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