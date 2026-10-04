import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import DataMatching from './pages/DataMatching'
import ShipmentBot from './pages/ShipmentBot'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/data-matching" element={<DataMatching />} />
        <Route path="/shipment-bot" element={<ShipmentBot />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
