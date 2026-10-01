
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvertedMouse from "./InvertedMouse";
import "./Demographics.css";

const FIELD_KEYS = ["name", "email", "dateOfBirth", "daysOld", "gender"];
const HOBBIES = [
  "Hiking", "Rock climbing", "Bouldering", "Trail running", "Cycling",
  "Mountain biking", "Swimming", "Yoga", "Pilates", "Weight training",
  "Dancing", "Photography", "Painting", "Drawing", "Pottery", "Sewing",
  "Knitting", "Cooking", "Baking", "Gardening", "Birdwatching", "Camping",
  "Fishing", "Kayaking", "Canoeing", "Surfing", "Skiing", "Snowboarding",
  "Skateboarding", "Tennis", "Pickleball", "Basketball", "Soccer",
  "Volleyball", "Baseball", "Golf", "Chess", "Board games", "Reading",
  "Writing", "Journaling", "Playing guitar", "Singing", "Podcasts",
  "Volunteering", "Traveling", "Woodworking", "Calligraphy", "Video games",
  "Stargazing",
];
const GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
];
const FAVORITE_CLIMBERS = [
  "Alex Honnold",
  "Janja Garnbret",
  "Adam Ondra",
  "Tommy Caldwell",
  "Sasha DiGiulian",
  "Brooke Raboutou",
  "Other",
];
const MAX_SELECTED_HOBBIES = 3;
const FIELD_PALETTE = [
  { name: "blue", background: "#DCEBFF", accent: "#2459A6" },
  { name: "green", background: "#DDF3E4", accent: "#287144" },
  { name: "orange", background: "#FFE1DA", accent: "#A33D2D" },
  { name: "yellow", background: "#FFF1C9", accent: "#8A6410" },
  { name: "purple", background: "#E8E1FF", accent: "#59419B" },
];
const FIELD_DESTINATION_COLORS = {
  name: "orange",
  email: "blue",
  dateOfBirth: "yellow",
  daysOld: "purple",
  gender: "green",
};
const FIELD_LABELS = {
  name: "Name",
  email: "email",
  dateOfBirth: "Date of birth",
  daysOld: "Days being alive (for verification)",
  gender: "Gender",
};
const COLOR_BY_NAME = Object.fromEntries(
  FIELD_PALETTE.map((color) => [color.name, color])
);

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function getRandomDisplayOrders() {
  const instructions = shuffle(FIELD_KEYS);
  const offset = 1 + Math.floor(Math.random() * (FIELD_KEYS.length - 1));

  return {
    instructions,
    inputs: [
      ...instructions.slice(offset),
      ...instructions.slice(0, offset),
    ],
  };
}

function assignTitleColors(fieldKeys, availableColors) {
  if (fieldKeys.length === 0) return {};

  const [fieldKey, ...remainingKeys] = fieldKeys;
  const choices = shuffle(
    availableColors.filter((color) => color.name !== FIELD_DESTINATION_COLORS[fieldKey])
  );

  for (const color of choices) {
    const remainingColors = availableColors.filter((item) => item !== color);
    const assignment = assignTitleColors(remainingKeys, remainingColors);

    if (assignment) return { ...assignment, [fieldKey]: color };
  }

  return null;
}

function getRandomFieldColors() {
  return assignTitleColors(FIELD_KEYS, FIELD_PALETTE);
}

function getFieldLabel(fieldKey) {
  const destinationColor = FIELD_DESTINATION_COLORS[fieldKey];
  return `${FIELD_LABELS[fieldKey]} in ${destinationColor} field`;
}

function getColorStyle(color) {
  return {
    "--field-color": color.background,
    "--field-accent": color.accent,
  };
}

function Demographics() {
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [birthDateParts, setBirthDateParts] = useState({ year: "", day: "", month: "" });
  const [daysOld, setDaysOld] = useState("");
  const [fieldColors] = useState(getRandomFieldColors);
  const [displayOrders] = useState(getRandomDisplayOrders);
  const [hobbies, setHobbies] = useState(() => shuffle(HOBBIES));
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [favoriteClimber, setFavoriteClimber] = useState("");
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);
  const genderTriggerRef = useRef(null);

  const navigate = useNavigate();

  const { year, day, month } = birthDateParts;
  const numericYear = Number(year);
  const numericDay = Number(day);
  const numericMonth = Number(month);
  const candidateDate = new Date(0);
  candidateDate.setUTCFullYear(numericYear, numericMonth - 1, numericDay);
  const dateOfBirth =
    year.length === 4 &&
    day !== "" &&
    month !== "" &&
    candidateDate.getUTCFullYear() === numericYear &&
    candidateDate.getUTCMonth() === numericMonth - 1 &&
    candidateDate.getUTCDate() === numericDay
      ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      : "";

  const calculateDaysOld = (birthDate) => {
    if (!birthDate) return null;

    const today = new Date();
    const [year, month, day] = birthDate.split("-").map(Number);
    const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const birthDateUtcDate = new Date(0);
    birthDateUtcDate.setUTCFullYear(year, month - 1, day);

    return Math.floor((todayUtc - birthDateUtcDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const isDaysOldCorrect =
    dateOfBirth &&
    daysOld !== "" &&
    Number(daysOld) === calculateDaysOld(dateOfBirth);
  const selectedGenderLabel =
    GENDER_OPTIONS.find((option) => option.value === selectedGender)?.label ?? "Select Date";
  const isFormComplete = Boolean(
    name.trim() &&
    email.trim() &&
    dateOfBirth &&
    isDaysOldCorrect &&
    selectedGender &&
    selectedHobbies.length === MAX_SELECTED_HOBBIES &&
    favoriteClimber
  );

  const handleSubmit = () => {
    if (isFormComplete) {
      navigate("/verify-hobbies", { state: { selectedHobbies } });
    } else {
      setShowSubmitWarning(true);
    }
  };

  const handleHobbyClick = (hobby) => {
    setSelectedHobbies((selected) => {
      if (selected.includes(hobby)) {
        return selected.filter((item) => item !== hobby);
      }
      return selected.length < MAX_SELECTED_HOBBIES
        ? [...selected, hobby]
        : selected;
    });

    setHobbies((current) => {
      const shuffled = shuffle(current);
      return shuffled.every((item, index) => item === current[index])
        ? [...shuffled.slice(1), shuffled[0]]
        : shuffled;
    });
  };

  const renderInput = (fieldKey) => {
    switch (fieldKey) {
      case "name":
        return (
          <input
            id="name"
            aria-labelledby="instruction-name"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        );
      case "email":
        return (
          <input
            id="email"
            aria-labelledby="instruction-email"
            type="text"
            name="email"
            value={email}
            onChange={(event) => setemail(event.target.value)}
          />
        );
      case "dateOfBirth":
        return (
          <div className="birth-date-fields">
            <input
              id="birth-year"
              aria-labelledby="instruction-dateOfBirth"
              aria-label="Birth year"
              type="number"
              min="1"
              max="9999"
              step="1"
              placeholder="What a decade is made up of"
              value={year}
              onChange={(event) => {
                setBirthDateParts((parts) => ({ ...parts, year: event.target.value }));
                setDaysOld("");
              }}
            />
            <input
              id="birth-day"
              aria-labelledby="instruction-dateOfBirth"
              aria-label="Birth day"
              type="number"
              min="1"
              max="31"
              step="1"
              placeholder="There's 24 hours in this"
              value={day}
              onChange={(event) => {
                setBirthDateParts((parts) => ({ ...parts, day: event.target.value }));
                setDaysOld("");
              }}
            />
            <input
              id="birth-month"
              aria-labelledby="instruction-dateOfBirth"
              aria-label="Birth month"
              type="number"
              min="1"
              max="12"
              step="1"
              placeholder="There's 12 of these in one of the first field"
              value={month}
              onChange={(event) => {
                setBirthDateParts((parts) => ({ ...parts, month: event.target.value }));
                setDaysOld("");
              }}
            />
          </div>
        );
      case "daysOld":
        return (
          <>
            <input
              id="days-old"
              aria-labelledby="instruction-daysOld"
              type="number"
              min="0"
              value={daysOld}
              onChange={(e) => setDaysOld(e.target.value)}
            />
            {daysOld !== "" && dateOfBirth && (
              <p
                style={{
                  color: isDaysOldCorrect ? "red" : "green",
                  fontSize: "0.8rem",
                }}
              >
                {isDaysOldCorrect
                  ? "That is not Incorrect."
                  : "That is not correct."}
              </p>
            )}
          </>
        );
      case "gender":
        return (
          <div className="gender-picker">
            <button
              id="gender"
              ref={genderTriggerRef}
              type="button"
              className="gender-picker-trigger"
              aria-labelledby="instruction-gender"
              aria-haspopup="listbox"
              aria-expanded={isGenderOpen}
              aria-controls="gender-options"
              onClick={() => setIsGenderOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setIsGenderOpen(false);
                if (event.key === "ArrowDown" && !isGenderOpen) setIsGenderOpen(true);
              }}
            >
              {selectedGenderLabel}
            </button>
            {isGenderOpen && (
              <div id="gender-options" className="gender-options" role="listbox" aria-labelledby="instruction-gender">
                {GENDER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="gender-option"
                    role="option"
                    aria-selected={selectedGender === option.value}
                    onClick={() => {
                      setSelectedGender(option.value);
                      setIsGenderOpen(false);
                      genderTriggerRef.current?.focus();
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="demographics-page">
      <InvertedMouse size={8} borderWidth={1} blink />
      <h1>
        SIGN UP{" "}
        <button
          onClick={handleSubmit}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            cursor: "pointer",
            color: "black"
          }}
        >
          !
        </button>
      </h1>

      <p
        style={{
          fontSize: "0.45rem",
          color: "grey",
          marginTop: "-10px",
        }}
      >
        when you are done filling out the field please click the exclamation
        mark in the title to submit
      </p>

      <div className="signup-layout">
        <section className="signup-instructions" aria-label="Field instructions">
          <h2>Instructions</h2>
          <div className="signup-instruction-list">
          {displayOrders.instructions.map((fieldKey) => {
            const inputId = fieldKey === "dateOfBirth"
              ? "birth-year"
              : fieldKey === "daysOld"
                ? "days-old"
                : fieldKey;

            return (
              <div
                className="signup-title-card"
                key={fieldKey}
                style={getColorStyle(fieldColors[fieldKey])}
              >
                <label id={`instruction-${fieldKey}`} htmlFor={inputId}>
                  {getFieldLabel(fieldKey)}
                </label>
              </div>
            );
          })}
          </div>
        </section>

        <section className="signup-inputs" aria-label="Form fields">
          <h2>Fields</h2>
          <div className="signup-input-list">
            {displayOrders.inputs.map((fieldKey) => (
              <div
                className={`signup-input-box${fieldKey === "dateOfBirth" ? " signup-input-box-date" : ""}`}
                key={fieldKey}
                style={getColorStyle(COLOR_BY_NAME[FIELD_DESTINATION_COLORS[fieldKey]])}
              >
                {renderInput(fieldKey)}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="hobby-picker" aria-labelledby="hobby-heading">
        <div className="hobby-picker-layout">
          <div className="hobby-picker-content">
            <div className="hobby-picker-header">
              <h2 id="hobby-heading">Click your top {MAX_SELECTED_HOBBIES} hobbies - CHOOSE CAREFULLY</h2>
              <p className="hobby-selection-count" aria-live="polite">
                {selectedHobbies.length} of {MAX_SELECTED_HOBBIES} selected
                {selectedHobbies.length === MAX_SELECTED_HOBBIES && ". Click a selected hobby to remove it."}
              </p>
            </div>
            <div className="hobby-grid">
              {hobbies.map((hobby) => {
                const selected = selectedHobbies.includes(hobby);

                return (
                  <button
                    type="button"
                    key={hobby}
                    className={`hobby-button${selected ? " hobby-button-selected" : ""}`}
                    aria-pressed={selected}
                    onClick={() => handleHobbyClick(hobby)}
                  >
                    {hobby}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="signup-exit-wrap">
            <button
              type="button"
              className={`signup-exit-button${isFormComplete ? " signup-exit-button-complete" : ""}`}
              aria-label="Exit signup and return to the start"
              onClick={() => navigate("/")}
            >
              
            </button>
            {isFormComplete && (
              <span className="signup-exit-check" role="img" aria-label="All fields complete">
                ✓
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="favorite-climber-question" aria-labelledby="favorite-climber-heading">
        <fieldset>
          <legend id="favorite-climber-heading">Who is your favorite climber?</legend>
          <div className="favorite-climber-options">
            {FAVORITE_CLIMBERS.map((climber) => (
              <label className="favorite-climber-option" key={climber}>
                <input
                  type="radio"
                  name="favoriteClimber"
                  value={climber}
                  checked={favoriteClimber === climber}
                  onChange={() => setFavoriteClimber(climber)}
                />
                <span>{climber}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {showSubmitWarning && (
        <div className="submit-warning-overlay">
          <section
            className="submit-warning-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="submit-warning-title"
          >
            <button
              type="button"
              className="submit-warning-home"
              aria-label="Go to home page"
              onClick={() => navigate("/")}
            >
              ×
            </button>
            <div className="submit-warning-message">
              <h2 id="submit-warning-title">WRONG!</h2>
              <p>Something is missing or incorrect.</p>
            </div>
            <button
              type="button"
              className="submit-warning-tomato"
              aria-label="Close this message"
              onClick={() => setShowSubmitWarning(false)}
            >
              <span aria-hidden="true">🍅</span>
            </button>
            <button
              type="button"
              className="submit-warning-close"
              onClick={() => navigate("/")}
            >
              CLOSE
            </button>
            <div className="submit-warning-instructions">
              <span>click the x or close button to go to home page</span>
              <span>click the tomato to close this message</span>
            </div>
          </section>
        </div>
      )}

    </main>
  );
}

export default Demographics;

