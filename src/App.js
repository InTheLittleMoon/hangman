import React, { useEffect, useState } from "react";
import "./App.css";

//component imports
import AnswerContainer from "./components/answerContainer/answerContainer";
import UsedLetterContainer from "./components/usedLetterContainer/usedLetterContainer";
import Header from "./components/header/header";

function App() {
  //held states
  const [currentWord, setCurrentWord] = useState("");
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [attempts, setAttempts] = useState(null);
  const [playable, setPlayable] = useState(true);

  const getWord = async () => {
    let temp = await fetch("https://random-word-api.herokuapp.com/word")
      .then((res) => res.json())
      .then((data) => {
        setCurrentWord(data[0]);
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
      if (attempts === 0) {
        setPlayable(false);
      } else {
        setAttempts((prevVal) => {
          let newVal = prevVal - 1;
          return newVal;
        });
      }
    }
  }, [wrongLetters]);

  //should track keyboard inputs for game when window is primarily focused
  useEffect(() => {
    const handlekeyboardinput = (event) => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toLowerCase();
        const word = currentWord;

        //if letter choice is correct
        if (word.includes(letter)) {
          //checks if correct letters does not include the 'letter'
          if (!correctLetters.includes(letter)) {
            setCorrectLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            //should display a 'same letter' notification
          }
        }
        //if letter choice is wrong
        else {
          //checks if wrong letters does not include the 'letter'
          if (!wrongLetters.includes(letter)) {
            setWrongLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            //should display a 'same letter' notification
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

  return (
    <div className="main-container">
      <Header currentWord={currentWord} attempts={attempts} getWord={getWord} />
      <AnswerContainer
        correctLetters={correctLetters}
        currentWord={currentWord}
      />
      <UsedLetterContainer wrongLetters={wrongLetters} />
    </div>
  );
}

export default App;
