import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvertedMouse from "./InvertedMouse";
import "./Alex.css";

const RED_BUTTON_COLOR = { backgroundColor: "#ff0000", color: "#ffffff" };
const GREEN_BUTTON_COLOR = { backgroundColor: "#008000", color: "#ffffff" };

function getNextButtonColors(current) {
  return {
    back: current.back.backgroundColor === RED_BUTTON_COLOR.backgroundColor
      ? GREEN_BUTTON_COLOR
      : RED_BUTTON_COLOR,
    load: current.load.backgroundColor === RED_BUTTON_COLOR.backgroundColor
      ? GREEN_BUTTON_COLOR
      : RED_BUTTON_COLOR,
  };
}

function Alex() {
  const navigate = useNavigate();
  const backButtonRef = useRef(null);
  const loadButtonRef = useRef(null);
  const [positions, setPositions] = useState(null);
  const [buttonColors, setButtonColors] = useState({
    back: RED_BUTTON_COLOR,
    load: GREEN_BUTTON_COLOR,
  });

  const getRandomPosition = (button) => {
    const bounds = button.getBoundingClientRect();
    const minLeft = bounds.width / 2;
    const maxLeft = Math.max(minLeft, window.innerWidth - bounds.width / 2);
    const minTop = bounds.height / 2;
    const maxTop = Math.max(minTop, window.innerHeight - bounds.height / 2);
    const currentLeft = bounds.left + bounds.width / 2;
    const currentTop = bounds.top + bounds.height / 2;
    let left = Math.round(minLeft + Math.random() * (maxLeft - minLeft));
    let top = Math.round(minTop + Math.random() * (maxTop - minTop));

    if (maxLeft > minLeft && left === Math.round(currentLeft)) {
      left = left < maxLeft ? left + 1 : left - 1;
    }
    if (maxTop > minTop && top === Math.round(currentTop)) {
      top = top < maxTop ? top + 1 : top - 1;
    }

    return { left: `${left}px`, top: `${top}px` };
  };

  const teleportButtons = () => {
    setPositions({
      back: getRandomPosition(backButtonRef.current),
      load: getRandomPosition(loadButtonRef.current),
    });
    setButtonColors((current) => getNextButtonColors(current));
  };

  return (
    <div className="background-image">
      <h1 style={{ color: 'white' }}>Hello, I am Alex!</h1>
      <button
        ref={backButtonRef}
        style={{ ...positions?.back, ...buttonColors.back }}
        onClick={() => {
          setButtonColors((current) => getNextButtonColors(current));
          navigate('/');
        }}
        className="back-button"
      >
        click if you like alex and really like rocks or maybe you have no idea who this person is
        and why he is on the screen but you want to go back to the previous page because 
        this is where you don't want to be so you click this button instead of doing nothing</button> 
      <InvertedMouse />
      <button
        ref={loadButtonRef}
        style={{ ...positions?.load, ...buttonColors.load }}
        onClick={teleportButtons}
        className="load-button"
      >click if you like alex and really like rocks or maybe you have no idea who this person is
        and why he is on the screen but you want to go stay here and look at his hands and try to understand how he does these amazing things instead of doing nothing</button>
    </div>
  );
}

export default Alex;