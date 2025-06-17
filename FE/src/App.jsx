import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BuildingBlockManagement from './pages/BuildingBlockManagement'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/building-blocks" element={<BuildingBlockManagement />} />
      </Routes>
    </Router>
  )
}

export default App
