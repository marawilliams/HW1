import './App.css'
import {Routes, Route, useNavigate} from 'react-router-dom'
import Alex from './Alex'
import Demographics from './Demographics'
import InvertedMouse from './InvertedMouse'
import ThankYou from './thankyou'
import AboutMe from './AboutMe'
import HobbyCheck from './HobbyCheck'

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app-background">
      <div className="ticks"></div>
      <button
        type="button"
        className="info-button"
        aria-label="About me"
        onClick={() => navigate('/about')}
      >
        i
      </button>
      <h1 className="app-title">find a climbing partner! <br/> click on Alex to start</h1>
      <section id="spacer"></section>
      <InvertedMouse />
      <button onClick={() => { navigate('/alex') }} className="app-button">ALEX</button>   
      <button
        type="button"
        onClick={() => { navigate('/browse') }}
        className="alex-button"
        aria-label="Select Alex in the photo"
      />
    </div>
  )
}

function App(){
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/alex" element={<Alex />} />
      <Route path="/browse" element={<Demographics />} />
      <Route path="/thankyou" element={<ThankYou />} />
      <Route path="/verify-hobbies" element={<HobbyCheck />} />
      <Route path="/about" element={<AboutMe />} />
    </Routes>
  )
}
export default App