import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import aspireLogo from '/Aspire.png'
import './App.css'
import Home from './pages/Home'
import Weather from './pages/Weather'
import Bff from './pages/Bff'

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <a 
            href="https://aspire.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Visit Aspire website (opens in new tab)"
            className="logo-link"
          >
            <img src={aspireLogo} className="logo" alt="Aspire logo" />
          </a>
          <h1 className="app-title">Aspire Starter</h1>
          <p className="app-subtitle">Modern distributed application development</p>
        </header>

        <nav className="main-nav" aria-label="Main navigation">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/bff" className="nav-link">Bff</Link>
          <Link to="/weather" className="nav-link">Weather</Link>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/bff" element={<Bff />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <nav aria-label="Footer navigation">
            <a href="https://aspire.dev" target="_blank" rel="noopener noreferrer">
              Learn more about Aspire<span className="visually-hidden"> (opens in new tab)</span>
            </a>
            <a 
              href="https://github.com/dotnet/aspire" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
              aria-label="View Aspire on GitHub (opens in new tab)"
            >
              <img src="/github.svg" alt="" width="24" height="24" aria-hidden="true" />
              <span className="visually-hidden">GitHub</span>
            </a>
          </nav>
        </footer>
      </div>
    </Router>
  )
}

export default App
