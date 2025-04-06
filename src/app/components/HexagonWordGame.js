'use client';

import React, { useState, useEffect } from 'react';

const HexagonWordGame = () => {
  // Game states
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [validWords, setValidWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [message, setMessage] = useState('Select letters to form words!');
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Sample letters for the honeycomb (English)
  const letters = ['S', 'T', 'A', 'R', 'E', 'P', 'L'];

  // Sample English words that can be formede
  const possibleWords = [
    'STAR', 'ARTS', 'TARE', 'RATE', 'PEAR', 'LEAP', 'PALE',
    'PELT', 'SEAL', 'LEAP', 'PLEA', 'TAPE', 'PART', 'ARTS',
    'RATS', 'SEAT', 'TEAR', 'PAST', 'SALT', 'TAPS', 'PETS', 'TALE'
  ];

  useEffect(() => {
    // Set up valid words from the possible words list
    setValidWords(possibleWords);
    
    // Initial animation when game starts
    if (gameStarted) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    resetGame();
  };

  const handleCellClick = (index) => {
    // Check if already selected
    const cellAlreadySelected = selectedCells.includes(index);
    
    if (cellAlreadySelected) {
      // If clicking the last cell, deselect it
      if (selectedCells[selectedCells.length - 1] === index) {
        setSelectedCells(selectedCells.slice(0, -1));
        setCurrentWord(currentWord.slice(0, -1));
      }
      return;
    }
    
    // Add cell to selected cells
    setSelectedCells([...selectedCells, index]);
    setCurrentWord(currentWord + letters[index]);
  };

  const checkWord = () => {
    if (currentWord.length < 2) {
      setMessage('Select at least 2 letters!');
      return;
    }

    if (validWords.includes(currentWord)) {
      if (foundWords.includes(currentWord)) {
        setMessage('You already found this word!');
      } else {
        setMessage(`Correct! You found "${currentWord}"!`);
        setFoundWords([...foundWords, currentWord]);
        setScore(score + currentWord.length * 10);
        
        // Flash animation for success
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);
      }
    } else {
      setMessage(`"${currentWord}" is not a valid word.`);
    }

    // Reset selection
    setSelectedCells([]);
    setCurrentWord('');
  };

  const resetGame = () => {
    setSelectedCells([]);
    setCurrentWord('');
    setFoundWords([]);
    setMessage('Select letters to form words!');
    setScore(0);
    
    // Reset animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Hexagon positioning - using a more compact honeycomb pattern
  const hexPositions = [
    { top: 50, left: 85 },   // Center cell
    { top: 8, left: 85 },    // Top
    { top: 29, left: 40 },   // Top left
    { top: 71, left: 40 },   // Bottom left
    { top: 92, left: 85 },   // Bottom
    { top: 71, left: 130 },  // Bottom right
    { top: 29, left: 130 },  // Top right
  ];

  // Calculate animation delay for each cell
  const getAnimationDelay = (index) => {
    return `${index * 0.1}s`;
  };

  // Start Screen
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 w-full h-96 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-amber-800 tracking-tight">Honeycomb Word Game</h1>
        <p className="text-amber-700 mb-8 text-center max-w-md">
          Connect the hexagon cells to form words and earn points! 
          How many words can you discover?
        </p>
        <button 
          onClick={startGame}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl text-xl"
        >
          Start Game
        </button>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="flex flex-col items-center p-6 w-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-amber-800 tracking-tight">Honeycomb Word Game</h1>
      
      <div className="relative mb-6 bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <p className="text-amber-800 text-sm font-medium mb-1">Current Word:</p>
            <div className="h-10 flex items-center">
              <span className="text-2xl font-bold text-amber-900">{currentWord || '___'}</span>
            </div>
          </div>
          <div className="flex-1 text-right">
            <p className="text-amber-800 text-sm font-medium mb-1">Score:</p>
            <div className="h-10 flex items-center justify-end">
              <span className="text-2xl font-bold text-amber-900">{score}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-center p-2 bg-amber-50 rounded-md">
          <p className={`text-sm transition-all duration-300 ${message.includes('Correct') ? 'text-green-600 font-medium' : 'text-amber-700'}`}>
            {message}
          </p>
        </div>
      </div>
      
      <div className="relative h-48 w-72 mb-8">
        {letters.map((letter, index) => (
          <div
            key={index}
            className={`absolute w-16 h-16 flex items-center justify-center text-2xl font-bold cursor-pointer shadow-lg transform transition-all duration-300
              ${selectedCells.includes(index) 
                ? 'bg-amber-500 text-white scale-110 shadow-amber-300' 
                : 'bg-gradient-to-br from-amber-300 to-amber-400 text-amber-900 hover:bg-amber-400 hover:scale-105'}`}
            style={{
              top: `${hexPositions[index].top}px`,
              left: `${hexPositions[index].left}px`,
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              animation: isAnimating ? `fadeInHex 0.5s ease-out forwards, pulseHex 2s infinite ${index % 2 === 0 ? '' : '1s'}` : '',
              animationDelay: getAnimationDelay(index),
              opacity: isAnimating ? '0' : '1',
              transform: selectedCells.includes(index) ? 'scale(1.1)' : 'scale(1)',
            }}
            onClick={() => handleCellClick(index)}
          >
            {letter}
          </div>
        ))}
        <style jsx>{`
          @keyframes fadeInHex {
            from { opacity: 0; transform: translateY(20px) scale(0.8); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes pulseHex {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={checkWord}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          Check Word
        </button>
        <button 
          onClick={resetGame}
          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          Reset Game
        </button>
        <button 
          onClick={() => setGameStarted(false)}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          Exit
        </button>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold mb-3 text-amber-800 border-b border-amber-100 pb-2">Words Found:</h3>
        <div className="flex flex-wrap gap-2">
          {foundWords.length > 0 ? (
            foundWords.map((word, index) => (
              <span 
                key={index} 
                className="bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
              >
                {word}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">You haven't found any words yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HexagonWordGame;