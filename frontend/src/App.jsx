import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BrowseResourcesPage from './pages/user/BrowseResourcesPage'
import ManageResourcesPage from './pages/admin/ManageResourcesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrowseResourcesPage />} />
        <Route path="/admin/resources" element={<ManageResourcesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
