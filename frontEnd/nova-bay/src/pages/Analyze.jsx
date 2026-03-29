import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/Map/MapView'
import RiskMapSidebar from '../components/RiskMap/RiskMapSidebar'
import { supabase } from '../supabaseClient' // Ensure this path is correct
import './Analyze.css'

function Analyze() {
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [report, setReport] = useState(null) // NEW: Holds AI text
  const [isAnalyzing, setIsAnalyzing] = useState(false) // NEW: Loading state
  const navigate = useNavigate()

  // Reset the report whenever a user clicks a new property
  useEffect(() => {
    setReport(null)
  }, [selectedParcel])

  useEffect(() => {
    const resizeTimer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
    return () => clearTimeout(resizeTimer)
  }, [])

  // NEW: Function to trigger the Anthropic AI Agent
  const handleAIAnalysis = async () => {
    if (!selectedParcel) return
    
    setIsAnalyzing(true)
    try {
      const { data, error } = await supabase.functions.invoke('resilience-agent', {
        body: { folio: selectedParcel.folio }
      })

      if (error) throw error
      
      // Anthropic API returns content in an array format
      setReport(data.content[0].text)
    } catch (err) {
      console.error("AI Analysis failed:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="analyze-page">
      <header className="analyze-topbar">
        <div className="topbar-left">
          <button type="button" className="analyze-back" onClick={() => navigate('/')}>
            ← Back
          </button>
          <div className="analyze-brand">NovaBay</div>
        </div>
        <div className="topbar-right">
          <div className="region-badge">
            <span className="region-dot" aria-hidden="true" />
            <span>Tampa Bay Region</span>
          </div>
          <span className="sources-text">FEMA · NOAA · USGS</span>
        </div>
      </header>

      {/* Passing the new AI states and trigger function as props */}
      <RiskMapSidebar 
        selectedParcel={selectedParcel} 
        report={report}
        isAnalyzing={isAnalyzing}
        onAnalyzeClick={handleAIAnalysis}
      />

      <div className="analyze-main">
        <main className="analyze-map-area">
          <MapView onParcelSelect={setSelectedParcel} />
        </main>
      </div>
    </div>
  )
}

export default Analyze