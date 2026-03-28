import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Analyze from './pages/Analyze'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
