import { useEffect, useState } from "react";
import InvertedMouse from "./InvertedMouse";

function ThankYou() {
  const [elapsedSeconds, setElapsedSeconds] = useState(null);

  useEffect(() => {
    const savedCompletionTime = Number(sessionStorage.getItem("signupCompletedAt"));
    const completedAt = savedCompletionTime > 0 ? savedCompletionTime : Date.now();
    sessionStorage.setItem("signupCompletedAt", String(completedAt));

    const startedAt = Number(sessionStorage.getItem("signupStartedAt"));
    if (startedAt > 0) {
      setElapsedSeconds(Math.floor(Math.max(0, completedAt - startedAt) / 1000));
    }
  }, []);

  const hours = elapsedSeconds === null ? 0 : Math.floor(elapsedSeconds / 3600);
  const minutes = elapsedSeconds === null ? 0 : Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds === null ? 0 : elapsedSeconds % 60;
  const formattedTime = elapsedSeconds === null
    ? "..."
    : hours > 0
      ? `${hours}h ${minutes}m ${seconds}s`
      : minutes > 0
        ? `${minutes}m ${seconds}s`
        : `${seconds}s`;

  return (
    <main className="thank-you-screen">
      <section className="thank-you-content" aria-labelledby="thank-you-title">
        <p className="thank-you-eyebrow">SIGN-UP COMPLETE</p>
        <h1 id="thank-you-title">Your next climbing partner is out there.</h1>
        <div className="thank-you-divider" aria-hidden="true" />
        <p className="thank-you-time-label">TIME TO COMPLETE</p>
        <p className="thank-you-time" aria-live="polite">{formattedTime}</p>
        <p className="thank-you-wish">Good luck finding your climbing partner!</p>
      </section>
      <InvertedMouse />
    </main>
  );
}

export default ThankYou;