import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroMap from '../components/Map/HeroMap'
import RiskMapOverlay from '../components/HeroTransition/RiskMapOverlay'
import './Home.css'

const BRAND_CHARS = ['N','O','V','A','B','A','Y']

function Home() {
  const navigate = useNavigate()
  const mapBgRef = useRef(null)
  const bottomBarRef = useRef(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const homePageRef = useRef(null)
  const isTransitioningRef = useRef(false)

  useEffect(() => {
    isTransitioningRef.current = isTransitioning
    document.body.classList.toggle('home-map-active', isTransitioning)

    return () => {
      document.body.classList.remove('home-map-active')
    }
  }, [isTransitioning])

  // Mouse parallax on the satellite background
  useEffect(() => {
    let targetX = 0, targetY = 0
    let currentX = 0, currentY = 0
    const STRENGTH = 28
    const LERP = 0.045
    let rafId

    const onMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      targetX = nx * STRENGTH
      targetY = ny * STRENGTH
    }

    const animate = () => {
      if (isTransitioningRef.current) {
        rafId = requestAnimationFrame(animate)
        return
      }

      currentX += (targetX - currentX) * LERP
      currentY += (targetY - currentY) * LERP
      if (mapBgRef.current) {
        mapBgRef.current.style.transform =
          `translate(${-currentX}px, ${-currentY}px) scale(1.06)`
      }
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Stat count-up after bottom bar slides in
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!bottomBarRef.current) return
      bottomBarRef.current.querySelectorAll('.stat-num[data-target]').forEach((el) => {
        const target = parseInt(el.dataset.target, 10)
        const suffix = el.dataset.suffix || ''
        const start = performance.now()
        const duration = 2200
        const step = (now) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
          el.textContent = Math.round(eased * target).toLocaleString() + suffix
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    }, 2650)
    return () => clearTimeout(timer)
  }, [])

  // Handle hero-to-map transition
  const handleExploreRiskMap = () => {
    setIsTransitioning(true)
    if (homePageRef.current) {
      homePageRef.current.classList.add('hero-transitioning')
    }
  }
  // hello world

  const handleTransitionClose = () => {
    if (homePageRef.current) {
      homePageRef.current.classList.remove('hero-transitioning')
    }

    if (mapBgRef.current) {
      mapBgRef.current.style.transform = 'translate(0px, 0px) scale(1.06)'
    }

    setIsTransitioning(false)
  }

  return (
    <div className={`home-page${isTransitioning ? ' hero-transitioning map-active' : ''}`} ref={homePageRef}>
      <section className="hero-section">
      <div className="hero-map-bg" aria-hidden="true" ref={mapBgRef}>
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
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/risk-map'); }}>Risk Map</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/analyzer'); }}>Analyzer</a></li>
          </ul>
        </nav>

        <button type="button" className="nav-cta" onClick={() => navigate('/analyzer')}>
          Get Started
        </button>
      </header>

      <main className="home-main">
        <div className="pre-rule" aria-hidden="true" />
        <div className="brand-wrap">
          <h1 className="brand">
            {BRAND_CHARS.map((ch, i) => (
              <span key={i} className="char">{ch}</span>
            ))}
          </h1>
        </div>
        <p className="brand-tagline">
          Build Smarter. Build <em>Safer.</em>
        </p>
        <p className="brand-desc">
          NovaBay analyzes flood risk, GIS data, and building materials to help
          Tampa Bay developers build structures that survive what the water
          brings.
        </p>

        <div className="cta-row">
          <button type="button" className="btn-main" onClick={handleExploreRiskMap}>
            Explore Risk Map
          </button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/analyzer')}>
            Analyze Your Project
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

      <section className="bottom-bar" aria-label="Platform statistics" ref={bottomBarRef}>
        <article className="stat-block">
          <span className="stat-num" data-target="2400" data-suffix="+">0</span>
          <span className="stat-label">Parcels Analyzed</span>
        </article>
        <article className="stat-block">
          <span className="stat-num">FEMA A–V</span>
          <span className="stat-label">Zone Coverage</span>
        </article>
        <article className="stat-block">
          <span className="stat-num" data-target="12" data-suffix=" yrs">0</span>
          <span className="stat-label">Industry Experience</span>
        </article>
        <article className="stat-block">
          <span className="stat-num" data-target="98" data-suffix="%">0</span>
          <span className="stat-label">Accuracy Rate</span>
        </article>
      </section>

      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
      </section>

      <section className="info-section how-section">
        <div className="section-inner">
          <div className="section-label">Process</div>
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-num">01</span>
              <h3 className="step-heading">Enter Your Location</h3>
              <p className="step-body">Drop a pin or type an address anywhere in the Tampa Bay region. NovaBay pinpoints your parcel to the meter using county parcel data and GIS boundary layers.</p>
            </div>
            <div className="step-card">
              <span className="step-num">02</span>
              <h3 className="step-heading">Analyze Risk Data</h3>
              <p className="step-body">We cross-reference FEMA flood zones, LiDAR elevation models, storm surge history, and county GIS layers in real time to generate a complete risk profile.</p>
            </div>
            <div className="step-card">
              <span className="step-num">03</span>
              <h3 className="step-heading">Receive Your Report</h3>
              <p className="step-body">Get a clear risk classification, recommended base flood elevation, and material guidelines optimized for your specific zone and project type.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section features-section">
        <div className="section-inner">
          <div className="section-label">Capabilities</div>
          <h2 className="section-title">What We Analyze</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">◈</div>
              <h3>Flood Zone Classification</h3>
              <p>Full FEMA Zone A through V coverage — including AE, AO, VE, and X zones — mapped to your exact parcel boundary using official NFHL data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">◉</div>
              <h3>Elevation &amp; Topography</h3>
              <p>High-resolution LiDAR elevation data surfaces how water will move across your site during a 100-year or 500-year flood event.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">◬</div>
              <h3>Storm Surge History</h3>
              <p>Decades of Gulf storm track data — including Irma, Ian, and Milton — contextualize your site's true exposure and worst-case inundation scenarios.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">▣</div>
              <h3>Material Recommendations</h3>
              <p>Concrete, CMU, elevated framing, breakaway walls — we match ASCE 7 and Florida Building Code flood-resistant construction standards to your zone.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <p className="cta-eyebrow">Ready to understand your risk?</p>
          <h2 className="cta-heading">Explore the risk map today.</h2>
          <button type="button" className="btn-main cta-btn" onClick={handleExploreRiskMap}>
            View Risk Map
          </button>
        </div>
      </section>

      {/* Hero to Map Transition Overlay */}
      <RiskMapOverlay isActive={isTransitioning} onClose={handleTransitionClose} />
    </div>
  )
}

export default Home
