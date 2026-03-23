import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdsList from './pages/AdsList'
import AdDetails from './pages/AdDetails'
import AdEdit from './pages/AdEdit'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/ads" replace />} />
          <Route path="/ads" element={<AdsList />} />
          <Route path="/ads/:id" element={<AdDetails />} />
          <Route path="/ads/:id/edit" element={<AdEdit />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App