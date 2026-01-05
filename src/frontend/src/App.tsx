import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import aspireLogo from '/Aspire.png'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { TopBar } from './components/TopBar'
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout'
import Home from './pages/Home'
import Weather from './pages/Weather'
import Bff from './pages/Bff'
import Protected from './pages/Protected'

function App() {
  return (
    <Router>
      <AuthProvider>
        <TopBar />
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

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bff" element={<Bff />} />
              
              <Route element={
                <ProtectedRoute>
                  <AuthenticatedLayout />
                </ProtectedRoute>
              }>
                <Route path="/protected" element={<Protected />} />
                <Route path="/weather" element={<Weather />} />
              </Route>
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
      </AuthProvider>
    </Router>
  )
}

export default App
