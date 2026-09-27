import { useState } from 'react'
import './App.css'
import {Routes, Route, useNavigate} from 'react-router-dom'
import Alex from './Alex'
import InvertedMouse from './InvertedMouse'

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app-background">
      <div className="ticks"></div>
      <h1 className="app-title">find a climbing partner!</h1>
      <section id="spacer"></section>
      <InvertedMouse />
      <button onClick={() => { navigate('/alex') }}>ALEX</button>    </div>
  )
}

function App(){
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/alex" element={<Alex />} />
    </Routes>
  )
}
export default App