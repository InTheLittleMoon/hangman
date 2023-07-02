import React, { useEffect, useState } from "react";
import "./App.css";

//component imports
import AnswerContainer from "./components/answerContainer/answerContainer";
import UsedLetterContainer from "./components/usedLetterContainer/usedLetterContainer";
import Header from "./components/header/header";

export default function App() {
  //held states
  const [currentWord, setCurrentWord] = useState("");
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [attempts, setAttempts] = useState(null);
  const [playable, setPlayable] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);

  const getWord = async () => {
    await fetch("https://random-word-api.herokuapp.com/word")
      .then((res) => res.json())
      .then((data) => {
        let allCapsWord = data[0].toUpperCase();
        setCurrentWord(allCapsWord);
      })
      .catch((error) => console.log("Error in fetch call"));
  };

  //should track attempts per word
  //when your word is assigned, you have 60% of its length in tries
  const getAttemptsLeft = (arr) => {
    console.log("Current word", arr);
    const sixtyPercent = arr.length * 0.6;
    let retVal = Math.floor(sixtyPercent);
    setAttempts(retVal);
    console.log("Attempts: ", retVal);
  };

  useEffect(() => {
    if (currentWord !== "") {
      getAttemptsLeft(currentWord);
    }
  }, [currentWord]);

  // should track wrong letters and decrement attempts, switching playable to false at 0
  useEffect(() => {
    if (attempts !== null) {
      setAttempts((prevVal) => {
        let newVal = prevVal - 1;
        return newVal;
      });
    }
  }, [wrongLetters]);

  const endTheGame = () => {
    setPlayable(false);
    setShowFailurePopup(true);
  };

  useEffect(() => {
    if (attempts === 0) {
      endTheGame();
    }

    return;
  }, [attempts]);

  //should end game if word is guessed
  useEffect(() => {
    //stops popup render on first load
    if (currentWord === "") {
      return;
    }

    const uniqueLetters = new Set(currentWord.split(""));
    console.log(uniqueLetters);

    if (
      Array.from(uniqueLetters).every((letter) =>
        correctLetters.includes(letter)
      )
    ) {
      setShowSuccessPopup(true);
    }
  }, [correctLetters, currentWord]);

  //should track keyboard inputs for game when window is primarily focused
  useEffect(() => {
    const handlekeyboardinput = (event) => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toUpperCase();
        const word = currentWord;

        //if letter choice is correct
        if (word.includes(letter)) {
          //checks if correct letters does not include the 'letter'
          if (!correctLetters.includes(letter)) {
            setCorrectLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            //should display a 'same letter' notification
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 1500);
          }
        }
        //if letter choice is wrong
        else {
          //checks if wrong letters does not include the 'letter'
          if (!wrongLetters.includes(letter)) {
            setWrongLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            //should display a 'same letter' notification
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 1500);
          }
        }
      }
    };

    window.addEventListener("keydown", handlekeyboardinput);

    return () => window.removeEventListener("keydown", handlekeyboardinput);
  }, [playable, correctLetters, wrongLetters, currentWord]);

  //should start our game off at launch
  useEffect(() => {
    getWord();
  }, []);

  //when game is over
  const tryAgain = () => {
    setCurrentWord("");
    setCorrectLetters([]);
    setWrongLetters([]);
    setAttempts(null);
    setPlayable(true);
    setShowPopup(false);
    setShowSuccessPopup(false);
    setShowFailurePopup(false);

    getWord();
  };

  return (
    <div className="main-container">
      <Header currentWord={currentWord} attempts={attempts} getWord={getWord} />
      <AnswerContainer
        correctLetters={correctLetters}
        currentWord={currentWord}
      />
      <UsedLetterContainer wrongLetters={wrongLetters} />
      {showPopup && (
        <div className="popup">You've already tried this letter!</div>
      )}

      {showSuccessPopup && (
        <div className="sailure-container">
          <div className="success-popup">
            Congratulations, you've guessed the word!
          </div>
          <button
            className="tryAgain"
            onClick={() => {
              tryAgain();
            }}
          >
            Try Again?
          </button>
        </div>
      )}

      {showFailurePopup && (
        <div className="failure-container">
          <div className="failure-popup">
            Sorry, you've failed guessed the word!
          </div>
          <button
            className="tryAgain"
            onClick={() => {
              tryAgain();
            }}
          >
            Try Again?
          </button>
        </div>
      )}
    </div>
  );
}
