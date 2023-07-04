import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthContextProvider } from './context/AuthContext'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <AuthContextProvider>
          <Navbar />
          <div className="pages">
                <Routes>
                  {/* <Route 
                    path="/" 
                    element={<Home />} 
                  /> */}
                  <Route 
                    path="/login" 
                    element={<Login />} 
                  />
                  <Route 
                    path="/signup" 
                    element={<Signup />} 
                  />
                </Routes>
            </div>
        </AuthContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
