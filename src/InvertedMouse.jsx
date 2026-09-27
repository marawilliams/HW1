import { useState, useEffect, useRef } from "react";

export default function InvertedMouse() {
  const [fakePos, setFakePos] = useState({ x: 0, y: 0 });
  const fakePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const invertedX = window.innerWidth - e.clientX;
      const invertedY = window.innerHeight - e.clientY;

      fakePosRef.current = { x: invertedX, y: invertedY };
      setFakePos({ x: invertedX, y: invertedY });
    };

    const handleClick = (e) => {
      // Ignore synthetic clicks we trigger ourselves below (isTrusted is
      // false for .click() calls), so we don't get stuck in a loop.
      if (!e.isTrusted) return;

      e.preventDefault();
      e.stopPropagation();

      const { x, y } = fakePosRef.current;
      const target = document.elementFromPoint(x, y);

      if (target) {
        target.click();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick, true);
    };
  }, []);

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
        pointerEvents: "none",
        zIndex: 99999,
        transform: "translate(-50%, -50%)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    />
  );
}