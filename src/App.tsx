import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import NoMatch from './pages/Error/NoMatch'

const Leave = React.lazy(() => import('./pages/Leave/Leave'))

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path='leave' element={
          <React.Suspense>
            <Leave />
          </React.Suspense>
        } />
        <Route path='*' element={<NoMatch />} />
      </Route>
    </Routes>
  )
}

export default App
