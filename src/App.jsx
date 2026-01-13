import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProfileProvider } from './context/ProfileContext'
import Home from './pages/Home'
import Results from './pages/Results'
import Profiles from './pages/Profiles'
import Layout from './components/Layout'

function App() {
  return (
    <ProfileProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profiles" element={<Profiles />} />
          </Routes>
        </Layout>
      </Router>
    </ProfileProvider>
  )
}

export default App
