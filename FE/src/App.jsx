import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BuildingBlockManagement from './pages/BuildingBlockManagement'
import StudentManagement from './pages/StudentManagement'
import RoomManagement from './pages/RoomManagement'
import ServiceManagement from './pages/ServiceManagement'
import RoomRentalManagement from './pages/RoomRentalManagement'
import SearchPage from './pages/SearchPage'
import DataReport from './pages/DataReport'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/building-blocks" element={<BuildingBlockManagement />} />
        <Route path="/rooms" element={<RoomManagement />} />
        <Route path="/services" element={<ServiceManagement />} />
        <Route path="/room-rental" element={<RoomRentalManagement />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/data-report" element={<DataReport />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
