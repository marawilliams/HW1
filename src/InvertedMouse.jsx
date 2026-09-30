import { useState, useEffect, useRef } from "react";

export default function InvertedMouse({ size = 16, borderWidth = 2, blink = false }) {
  const [fakePos, setFakePos] = useState(() => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  }));
  const fakePosRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

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
        const control = target.closest("input, select, textarea, button, a, [contenteditable='true']") ||
          (target instanceof HTMLLabelElement ? target.control : null);

        if (control && !control.matches(":disabled")) {
          control.focus({ preventScroll: true });

          if (control instanceof HTMLSelectElement && typeof control.showPicker === "function") {
            control.showPicker();
            return;
          }
        }

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
      className={blink ? "inverted-cursor-blink" : undefined}
      style={{
        position: "fixed",
        left: `${fakePos.x}px`,
        top: `${fakePos.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "black",
        border: `${borderWidth}px solid white`,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 99999,
        transform: "translate(-50%, -50%)",
        boxShadow: size <= 8 ? "0 0 2px rgba(0, 0, 0, 0.9)" : "0 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    />
  );
}