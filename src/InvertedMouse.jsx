import { useState, useEffect } from "react";

export default function InvertedMouse() {
  const [fakePos, setFakePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
        const invertedX = window.innerWidth - e.clientX;
        const invertedY = window.innerHeight - e.clientY;

        setFakePos({ x: invertedX, y: invertedY });
    };

    const handlePhysicalMouse = (e) => {
        if (!e.isTrusted) return;

        e.preventDefault();
        e.stopPropagation();

        const elementAtFakePos = document.elementFromPoint(fakePos.x, fakePos.y);
        
        if (elementAtFakePos) {
            elementAtFakePos.click();
        }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handlePhysicalMouse, true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handlePhysicalMouse, true);
    };
  }, [fakePos]);

  return (
    <div 
      style={{ 
        position: "fixed",
        left: `${fakePos.x}px`, 
        top: `${fakePos.y}px`, 
        width: "16px", 
        height: "16px", 
        backgroundColor: "black",
        border: "2px solid white",
        borderRadius: "50%",
        pointerEvents: "none", // Keeps the dot from blocking elementFromPoint
        zIndex: 99999,
        transform: "translate(-50%, -50%)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)" // Fixed your "4x" typo to "4px"
      }}
    />
  );
}
