import { useEffect } from "react";
import InvertedMouse from "./InvertedMouse";

function ThankYou() {
  useEffect(() => {
    const savedCompletionTime = Number(sessionStorage.getItem("signupCompletedAt"));
    const completedAt = savedCompletionTime > 0 ? savedCompletionTime : Date.now();
    sessionStorage.setItem("signupCompletedAt", String(completedAt));
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: 'lightgray' }}>
      <h1>Thank you for signing up!</h1>
      <InvertedMouse />
   </div>
   
  );
}

export default ThankYou;