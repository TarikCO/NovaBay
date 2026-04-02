import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/Map/MapView'
import RiskMapSidebar from '../components/RiskMap/RiskMapSidebar'
import { supabase } from '../supabaseClient'
import './Analyze.css'

function Analyze() {
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [report, setReport] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null) // NEW: Error state
  const navigate = useNavigate()

  const onParcelSelect = useCallback((parcelProps) => {
  setSelectedParcel(parcelProps)
}, [])

  // Reset states when a new property is clicked
  useEffect(() => {
    setReport(null)
    setError(null)
  }, [selectedParcel])

  const handleAIAnalysis = async () => {
    if (!selectedParcel?.folio) return
    
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('resilience-agent', {
        body: { folio: selectedParcel.folio }
      })

      if (invokeError) throw invokeError
      
      // Anthropic returns the text inside a content array
      if (data?.content && data.content[0]) {
        setReport(data.content[0].text)
      } else {
        throw new Error("Invalid AI response format")
      }
    } catch (err) {
      console.error("AI Analysis failed:", err)
      setError("The AI agent is currently unavailable. Please try again in a moment.")
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

      <RiskMapSidebar 
        selectedParcel={selectedParcel} 
        report={report}
        isAnalyzing={isAnalyzing}
        onAnalyzeClick={handleAIAnalysis}
        error={error} // Passing error to sidebar
      />

      <div className="analyze-main">
        <main className="analyze-map-area">
          <MapView onParcelSelect={onParcelSelect} />
        </main>
      </div>
    </div>
  )
}

export default Analyze