import React from "react";
import "./usedLetterContainer.css";

export default function UsedLetterContainer({ wrongLetters }) {
  return (
    <div className="used-letters-container">
      {wrongLetters.length > 0 && (
        <h2 className="wrongLetters-title">Wrong Letters:</h2>
      )}
      <div className="wrongLetters-receptical">
        {wrongLetters
          .map((letter, index) => {
            return (
              <span key={index} className="wrongLetter">
                {wrongLetters.includes(letter) ? letter : ""}
              </span>
            );
          })
          //should add a comma in between all the wrong letters
          .reduce(
            (prev, current) =>
              prev === null ? [current] : [prev, ", ", current],
            null
          )}
      </div>
    </div>
  );
}
