import { useNavigate } from 'react-router-dom'
import HeroMap from '../components/Map/HeroMap'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="hero-map-bg" aria-hidden="true">
        <HeroMap />
      </div>
      <div className="hero-overlay" aria-hidden="true" />

      <header className="home-nav">
        <div className="logo-mark">
          <div className="logo-ring" aria-hidden="true" />
          <span className="logo-text">NovaBay</span>
        </div>

        <nav aria-label="Primary" className="nav-links-wrap">
          <ul className="nav-links">
            <li><a href="#">Platform</a></li>
            <li><a href="#">Risk Maps</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </nav>

        <button type="button" className="nav-cta" onClick={() => navigate('/analyze')}>
          Get Started
        </button>
      </header>

      <main className="home-main">
        <div className="pre-rule" aria-hidden="true" />
        <h1 className="brand-title">NovaBay</h1>
        <p className="brand-tagline">
          Build Smarter. Build <em>Safer.</em>
        </p>
        <p className="brand-desc">
          NovaBay analyzes flood risk, GIS data, and building materials to help
          Tampa Bay developers build structures that survive what the water
          brings.
        </p>

        <div className="cta-row">
          <button type="button" className="btn-main" onClick={() => navigate('/analyze')}>
            Analyze Your Project
          </button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/analyze')}>
            Explore Risk Maps
          </button>
        </div>
      </main>

      <div className="wave-strip" aria-hidden="true">
        <svg viewBox="0 0 2880 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,20 C180,5 360,35 540,20 C720,5 900,35 1080,20 C1260,5 1440,35 1620,20 C1800,5 1980,35 2160,20 C2340,5 2520,35 2700,20 C2760,14 2820,24 2880,20"
            fill="none"
            stroke="rgba(94,207,177,0.15)"
            strokeWidth="1.5"
          />
          <path
            d="M0,26 C200,10 400,38 600,22 C800,8 1000,36 1200,22 C1400,8 1600,38 1800,22 C2000,8 2200,38 2400,22 C2600,8 2750,34 2880,24"
            fill="none"
            stroke="rgba(94,207,177,0.07)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="location-tag">
        <div className="loc-dot" aria-hidden="true" />
        <span className="loc-text">Tampa Bay, Florida</span>
      </div>

      <section className="bottom-bar" aria-label="Platform statistics">
        <article className="stat-block">
          <span className="stat-num">2,400+</span>
          <span className="stat-label">Parcels Analyzed</span>
        </article>
        <article className="stat-block">
          <span className="stat-num">FEMA A-V</span>
          <span className="stat-label">Zone Coverage</span>
        </article>
        <article className="stat-block">
          <span className="stat-num">Real-Time</span>
          <span className="stat-label">Storm Surge Data</span>
        </article>
        <article className="stat-block">
          <span className="stat-num">98%</span>
          <span className="stat-label">Accuracy Rate</span>
        </article>
      </section>

      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </div>
  )
}

export default Home
