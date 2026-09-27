import { useState } from 'react'
import './App.css'
import {Routes, Route, useNavigate} from 'react-router-dom'
import Alex from './Alex'
import Demographics from './Demographics'
import InvertedMouse from './InvertedMouse'

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app-background">
      <div className="ticks"></div>
      <h1 className="app-title">find a climbing partner! <br/> click on Alex to start</h1>
      <section id="spacer"></section>
      <InvertedMouse />
      <button onClick={() => { navigate('/alex') }} className="app-button">ALEX</button>   
      <button onClick={() => { navigate('/browse') }} className="alex-button"></button>
    </div>
  )
}

function App(){
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/alex" element={<Alex />} />
      <Route path="/browse" element={<Demographics />} />
    </Routes>
  )
}
export default App