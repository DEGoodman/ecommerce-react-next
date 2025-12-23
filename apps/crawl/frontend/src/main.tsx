// ============================================================================
// APPLICATION ENTRY POINT
// ============================================================================
// This is where the React application starts. This file:
// 1. Imports React and ReactDOM
// 2. Finds the HTML element with id="root" (in index.html)
// 3. Renders the App component into that element
// ============================================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Create a React root and render the app
// The '!' tells TypeScript "I'm sure this element exists, trust me"
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode helps catch bugs during development
  // It runs some checks and warnings (only in dev, not production)
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
