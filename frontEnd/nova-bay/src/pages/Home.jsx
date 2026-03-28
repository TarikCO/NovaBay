import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
        <div className="hero-glow hero-glow-purple" aria-hidden="true" />
        <div className="hero-glow hero-glow-blue" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="particle p1" aria-hidden="true" />
        <div className="particle p2" aria-hidden="true" />
        <div className="particle p3" aria-hidden="true" />
        <div className="particle p4" aria-hidden="true" />
        <div className="particle p5" aria-hidden="true" />
        <div className="particle p6" aria-hidden="true" />
        <div className="particle p7" aria-hidden="true" />
        <div className="particle p8" aria-hidden="true" />
        <div className="particle p9" aria-hidden="true" />
        <div className="particle p10" aria-hidden="true" />
        <div className="particle p11" aria-hidden="true" />
        <div className="particle p12" aria-hidden="true" />

        <div className="hero-content">
          <h1>
            Build smarter. Build{' '}
            <span className="gradient-text">safer.</span>
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

        <div className="hero-waves" aria-hidden="true">
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
            <path
              className="wave wave-1"
              d="M0,80 C180,140 360,0 540,80 C720,160 900,20 1080,80 C1260,140 1440,60 1440,60 L1440,220 L0,220 Z"
            />
            <path
              className="wave wave-2"
              d="M0,110 C200,60 400,160 600,110 C800,60 1000,150 1200,110 C1350,80 1440,120 1440,120 L1440,220 L0,220 Z"
            />
            <path
              className="wave wave-3"
              d="M0,140 C240,100 480,180 720,140 C960,100 1200,160 1440,140 L1440,220 L0,220 Z"
            />
          </svg>
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
