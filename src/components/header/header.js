import React from "react";
import "./header.css";

export default function Header({ currentWord, attempts, getWord }) {
  return (
    <div className="header-container">
      <h1>Hangman</h1>
      <h3>Attempts left: {attempts}</h3>
    </div>
  );
}
