import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthContext } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Welcome from './pages/Welcome'
import PIN from './pages/PIN'

function App() {
  const {user} = useContext(AuthContext);

  return (
    <>
      <BrowserRouter>
          <Navbar />
          <div className="pages">
                <Routes>
                  { <Route 
                    path="/" 
                    element={user ? <Home /> : <Navigate to='/welcome' />} 
                  /> }
                  { <Route 
                    path="/pin"
                    element={user ? <PIN /> : <Navigate to='/welcome' />} 
                  /> }
                  { <Route 
                    path="/welcome" 
                    element={!user ? <Welcome /> : <Navigate to='/' />} 
                  /> }
                  <Route 
                    path="/login" 
                    element={!user ? <Login /> : <Navigate to='/' />} 
                  />
                  <Route 
                    path="/signup" 
                    element={!user ? <Signup /> : <Navigate to='/' />} 
                  />
                </Routes>
            </div>
      </BrowserRouter>
    </>
  )
}

export default App
