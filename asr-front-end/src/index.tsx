import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AppContextProvider } from './app-context/app-context'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppContextProvider> 
      <React.StrictMode>
        <App />
      </React.StrictMode>
  </AppContextProvider>
)