import { useAuth } from '../contexts/AuthContext'

function Protected() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <section className="weather-section" aria-labelledby="protected-heading">
      <div className="card">
        <div className="section-header">
          <h2 id="protected-heading" className="section-title">Protected Area</h2>
        </div>

        <div className="protected-content" style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
          <div className="info-section" style={{ margin: 0 }}>
            <h3 style={{ marginTop: 0 }}>Welcome {user.name}!</h3>
            <p style={{ margin: 0 }}>You are viewing content that is only rendered when you are authenticated.</p>
          </div>

          <div className="weather-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {user.claims.map((claim, index) => (
              <article key={`${claim.type}-${index}`} className="weather-card" aria-label={`${claim.type} claim`}>
                <h3 className="weather-date" style={{ fontSize: '0.95rem', letterSpacing: '0.01em' }}>{claim.type}</h3>
                <p className="weather-summary" style={{ fontWeight: 600, wordBreak: 'break-word' }}>{claim.value}</p>
              </article>
            ))}
          </div>

          <div className="section-header" style={{ marginTop: '0.5rem' }}>
            <div style={{ width: '100%', padding: '1rem', background: 'rgba(124, 146, 245, 0.1)', borderRadius: '0.5rem', wordBreak: 'break-word' }}>
              <strong>Protected content</strong>
              <p style={{ margin: '0.35rem 0 0 0' }}>
                This section only renders when you are authenticated. If you share this URL with someone who is not logged in, they will be redirected to the BFF page to sign in first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Protected