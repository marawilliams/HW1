import './App.css'
import { useEffect, useState } from 'react'
import {Routes, Route, useLocation, useNavigate} from 'react-router-dom'
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
      <h1 className="app-title">find a climbing partner! <br/> click on Alex to sign up</h1>
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

function SignupTimer() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const updateTime = () => setNow(Date.now());
    updateTime();
    const intervalId = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const startedAt = Number(sessionStorage.getItem('signupStartedAt'));
  const completedAt = Number(sessionStorage.getItem('signupCompletedAt'));
  const elapsedSeconds = startedAt > 0
    ? Math.floor(Math.max(0, (completedAt > 0 ? completedAt : now) - startedAt) / 1000)
    : null;
  const hours = elapsedSeconds === null ? 0 : Math.floor(elapsedSeconds / 3600);
  const minutes = elapsedSeconds === null ? 0 : Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds === null ? 0 : elapsedSeconds % 60;
  const formattedTime = elapsedSeconds === null
    ? 'not started'
    : hours > 0
      ? `${hours}h ${minutes}m ${seconds}s`
      : minutes > 0
        ? `${minutes}m ${seconds}s`
        : `${seconds}s`;

  return <output className="signup-timer">Signup time: {formattedTime}</output>;
}

function App(){
  const location = useLocation();

  useEffect(() => {
    sessionStorage.removeItem('signupCompletedAt');
    sessionStorage.setItem('signupStartedAt', String(Date.now()));
  }, []);

  return (
    <>
      {location.pathname !== '/thankyou' && <SignupTimer />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/alex" element={<Alex />} />
        <Route path="/browse" element={<Demographics />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/verify-hobbies" element={<HobbyCheck />} />
        <Route path="/about" element={<AboutMe />} />
      </Routes>
    </>
  )
}
export default App