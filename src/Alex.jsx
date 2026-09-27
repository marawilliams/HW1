import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import InvertedMouse from "./InvertedMouse";
import "./Alex.css";


function Alex() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = () => {
    setIsLoading((prev) => !prev);
  };

  return (
    <div className={`background-image ${isLoading ? "cursor-loading" : ""}`}>
      <h1 style={{ color: 'white' }}>Hello, I am Alex!</h1>
      <button onClick={() => { navigate('/') }} className="back-button">
        click if you like alex and really like rocks or maybe you have no idea who this person is
        and why he is on the screen but you want to go back to the previous page because 
        this is where you don't want to be so you click this button instead of doing nothing</button> 
      <InvertedMouse />
      <button className = "load-button">click if you like alex and really like rocks or maybe you have no idea who this person is
        and why he is on the screen but you want to go stay here and look at his hands and try to understand how he does these amazing things instead of doing nothing</button>
    </div>
  );
}

export default Alex;