import { Link } from 'react-router-dom'
import aspireLogo from '/Aspire.png'

function Home() {
  return (
    <section className="home-section">
      <div className="card welcome-card">
        <div className="welcome-content">
          <img src={aspireLogo} className="logo-large" alt="Aspire logo" />
          <h2 className="welcome-title">Welcome to Aspire Starter</h2>
          <p className="welcome-description">
            This is a modern distributed application starter built with .NET Aspire, 
            React, and TypeScript. Explore the application features:
          </p>
          <nav className="feature-links">
            <Link to="/weather" className="feature-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
              </svg>
              <span>View Weather Forecast</span>
            </Link>
          </nav>
          <div className="info-section">
            <h3>About this starter</h3>
            <p>
              This application demonstrates:
            </p>
            <ul className="features-list">
              <li>Backend for Frontend (BFF) pattern</li>
              <li>.NET Aspire orchestration</li>
              <li>React with TypeScript</li>
              <li>Modern responsive UI</li>
              <li>API integration</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
