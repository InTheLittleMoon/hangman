import React, { useEffect, useState } from "react";
import "./App.css";

//component imports
import AnswerContainer from "./components/answerContainer/answerContainer";
import UsedLetterContainer from "./components/usedLetterContainer/usedLetterContainer";
import Header from "./components/header/header";

function App() {
  //held states
  const [currentWord, setCurrentWord] = useState("apple");
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [playable, setPlayable] = useState(true);

  const getWord = async () => {
    await fetch("https://random-word-api.herokuapp.com/word")
      .then((res) => res.json())
      .then((data) => {
        setCurrentWord(data[0]);
      })
      .catch((error) => console.log("Error in fetch call"));

    console.log("Current word: ", currentWord);
  };

  //should start our game off at launch
  useEffect(() => {
    getWord();
  }, []);

  useEffect(() => {
    const handlekeyboardinput = (event) => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toLowerCase();

        //if letter choice is correct
        if (currentWord.includes(letter)) {
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
  }, [playable, correctLetters, wrongLetters]);

  return (
    <div className="main-container">
      <button
        onClick={() => {
          getWord();
        }}
      >
        new word
      </button>
      <Header />
      <AnswerContainer
        correctLetters={correctLetters}
        currentWord={currentWord}
      />
      <UsedLetterContainer wrongLetters={wrongLetters} />
    </div>
  );
}

export default App;
