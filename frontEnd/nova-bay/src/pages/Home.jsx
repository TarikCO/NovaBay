import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <h1>Build smarter. Build safer.</h1>
          <p>
            Stilts helps developers and architects build flood-resilient
            structures in Tampa Bay before disaster strikes.
          </p>
          <button
            type="button"
            className="hero-cta"
            onClick={() => navigate('/analyze')}
          >
            Analyze Your Project
          </button>
        </div>
      </section>

      <section className="stats-strip">
        <div className="stat-item">
          <strong>Tampa Bay</strong>
          <span>Area Covered</span>
        </div>
        <div className="stat-item">
          <strong>6 Data Layers</strong>
          <span>GIS Sources Analyzed</span>
        </div>
        <div className="stat-item">
          <strong>Real-Time</strong>
          <span>FEMA Flood Data</span>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <article className="step-card">
            <span className="step-number">01</span>
            <h3>Pin Your Location</h3>
            <p>Drop a pin anywhere in Tampa Bay.</p>
            <p>Start your flood risk analysis instantly.</p>
          </article>
          <article className="step-card">
            <span className="step-number">02</span>
            <h3>Input Your Materials</h3>
            <p>Tell us what you are building with.</p>
            <p>Map each choice to durability outcomes.</p>
          </article>
          <article className="step-card">
            <span className="step-number">03</span>
            <h3>Get Your Report</h3>
            <p>Receive an AI-powered resilience score.</p>
            <p>Review recommended material swaps.</p>
          </article>
        </div>
      </section>

      <footer className="home-footer">
        Built for the Tampa Bay Hackathon · Stilts © 2025
      </footer>
    </div>
  )
}

export default Home
