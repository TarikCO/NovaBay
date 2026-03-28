import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroMap from '../components/Map/HeroMap'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const targets = document.querySelectorAll('.step-card, .stat-item')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )

    targets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-map-bg" aria-hidden="true">
          <HeroMap />
        </div>
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-content">
          <h1>
            Build smarter. Build{' '}
            <span className="accent-text">safer.</span>
          </h1>
          <p>
            NovaBay analyzes flood risk, GIS data, and building materials to help
            Tampa Bay developers build structures that survive what the water
            brings.
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
          <strong>Hillsborough + Pinellas</strong>
          <span>Counties Covered</span>
        </div>
        <div className="stat-item">
          <strong>FEMA · NOAA · USGS</strong>
          <span>Live Data Sources</span>
        </div>
        <div className="stat-item">
          <strong>AI-Powered</strong>
          <span>Material Risk Analysis</span>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <article className="step-card">
            <span className="step-icon step-icon-water">◎</span>
            <span className="step-number">01</span>
            <h3>Pin Your Location</h3>
            <p>Drop a pin anywhere in Tampa Bay.</p>
            <p>Start your flood risk analysis instantly.</p>
          </article>
          <article className="step-card">
            <span className="step-icon step-icon-grid">⬡</span>
            <span className="step-number">02</span>
            <h3>Input Your Materials</h3>
            <p>Tell us what you are building with.</p>
            <p>Map each choice to durability outcomes.</p>
          </article>
          <article className="step-card">
            <span className="step-icon step-icon-report">◈</span>
            <span className="step-number">03</span>
            <h3>Get Your Report</h3>
            <p>Receive an AI-powered resilience score.</p>
            <p>Review recommended material swaps.</p>
          </article>
        </div>
      </section>

      <section className="why-tampa">
        <blockquote>
          Tampa Bay is one of the most flood-vulnerable metros in the United
          States. After Helene and Milton, building smart is not optional.
        </blockquote>
        <ul className="risk-facts">
          <li>
            <span className="risk-dot" aria-hidden="true" />
            9.3 ft storm surge recorded during Hurricane Helene
          </li>
          <li>
            <span className="risk-dot" aria-hidden="true" />
            40% of Tampa structures pre-date modern flood codes
          </li>
          <li>
            <span className="risk-dot" aria-hidden="true" />
            Over 200,000 properties in FEMA high-risk flood zones
          </li>
        </ul>
      </section>

      <footer className="home-footer">
        NovaBay · Built for the Tampa Bay Resilience Hackathon · 2025
      </footer>
    </div>
  )
}

export default Home
