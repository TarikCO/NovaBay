import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import NovaBay from './components/SandBox/NovaBay'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/sandbox" element={<NovaBay />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
