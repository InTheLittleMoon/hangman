import React from "react";
import "./answerContainer.css";

export default function AnswerContainer({ currentWord, correctLetters }) {
  return (
    <div className="correct-letters-container">
      {currentWord.split("").map((letter, index) => {
        return (
          <div className="letter-container">
            <span key={index} className="letter">
              {correctLetters.includes(letter) ? letter : ""}
            </span>
            <div className="underline"></div>
          </div>
        );
      })}
    </div>
  );
}
