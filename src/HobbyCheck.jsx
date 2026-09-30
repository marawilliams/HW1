import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InvertedMouse from "./InvertedMouse";
import "./HobbyCheck.css";

function normalizeHobby(hobby) {
  return hobby.trim().toLocaleLowerCase();
}

function HobbyCheck() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedHobbies = state?.selectedHobbies;
  const hasValidSelection =
    Array.isArray(selectedHobbies) &&
    selectedHobbies.length === 3 &&
    new Set(selectedHobbies.map(normalizeHobby)).size === 3;
  const [answers, setAnswers] = useState(["", "", ""]);
  const [checkResult, setCheckResult] = useState(null);

  const handleClearAnswers = () => {
    setAnswers(["", "", ""]);
    setCheckResult(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const enteredHobbies = answers.map(normalizeHobby);
    const expectedHobbies = new Set(selectedHobbies.map(normalizeHobby));
    const isCorrect =
      enteredHobbies.every(Boolean) &&
      new Set(enteredHobbies).size === 3 &&
      enteredHobbies.every((hobby) => expectedHobbies.has(hobby));

    setCheckResult(isCorrect ? "correct" : "incorrect");
  };

  if (!hasValidSelection) {
    return (
      <main className="hobby-check-page">
        <InvertedMouse size={8} borderWidth={1} blink />
        <section className="hobby-check-content">
          <h1>Identity check unavailable</h1>
          <p>Restart signup and select three hobbies before taking the check.</p>
          <button type="button" onClick={() => navigate("/browse", { replace: true })}>
            Restart signup
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="hobby-check-page">
      <InvertedMouse size={8} borderWidth={1} blink />
      <section className="hobby-check-content">
        <h1>Verify your identity</h1>
        <p>To verify your identity, re-enter the three hobbies you chose during signup. Type each one in any order; capitalization does not matter.</p>
        <form className="hobby-check-form" onSubmit={handleSubmit}>
          {answers.map((answer, index) => (
            <label className="hobby-check-field" key={index} htmlFor={`hobby-answer-${index + 1}`}>
              Hobby {index + 1}
              <input
                id={`hobby-answer-${index + 1}`}
                type="text"
                value={answer}
                autoComplete="off"
                onChange={(event) => {
                  const nextAnswers = [...answers];
                  nextAnswers[index] = event.target.value;
                  setAnswers(nextAnswers);
                  setCheckResult(null);
                }}
              />
            </label>
          ))}
          {checkResult && (
            <p className={`hobby-check-result hobby-check-result-${checkResult}`} role="alert">
              {checkResult === "correct"
                ? "Those answers match. Restart signup if you want or continue."
                : "Those answers don't match. Restart signup and begin again."}
            </p>
          )}
          <div className="hobby-check-actions">
  {checkResult === "correct" ? (
    <button type="button" onClick={() => navigate("/thankyou", { replace: true })}>
      Continue
    </button>
  ) : (
    <button type="button" onClick={handleClearAnswers}>
      Clear answers
    </button>
  )}
            {checkResult && (
              <button type="button" onClick={() => navigate("/browse", { replace: true })}>
                Restart signup
              </button>
            )}
            
          </div>
          <button
            type="submit"
            className="hobby-check-submit-link"
            aria-label="Click here to submit"
          >
            click here to submit
          </button>
        </form>
      </section>
    </main>
  );
}

export default HobbyCheck;
