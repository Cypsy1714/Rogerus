import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { MessageContextProvider } from './context/MessageContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <MessageContextProvider>
      <App/>
    </MessageContextProvider>
  </AuthContextProvider>
)
