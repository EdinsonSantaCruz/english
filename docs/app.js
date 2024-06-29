// app.js
const words = [
    "spaghetti", "yesterday", "brainstorm", "calculator", "categories", "classmates", "comprehend", "contribute", "correction", "exchanging",
    "headphones", "illustrate", "overcoming", "mechanical", "mysterious", "suggestion", "unscramble", "vocabulary", "accordingly", "affirmative",
    "comfortable", "demonstrate", "development", "differences", "environment", "imagination", "incorrectly", "information", "magnificent", "performance",
    "preparation", "questioning", "stomachache", "triceratops", "aggressively", "alphabetical", "characterize", "congratulate", "construction", "conversation",
    "descriptions", "disabilities", "disappearing", "explanation", "individually", "pterodactyls", "similarities", "successfully", "supermarkets", "strawberries",
    "odd", "zoo", "alive", "curl", "felt", "gain", "dawn", "dear", "gold", "path",
    "safe", "roof", "aunt", "self", "tuna", "few", "zero", "world", "wait", "uncle",
    "visit", "cheer", "jaw", "paper", "sharp", "sink", "twice", "middle", "paste", "animal",
    "chicken", "banana", "earth", "fever", "follow", "crow", "giant", "degree", "useful", "zebra",
    "cottage", "couch", "evening", "crumb", "decide", "camera", "garden", "false", "gasoline", "fruit",
];

let currentWord = '';
let recognizing = false;
let interim_transcript = '';
let lives = 3;
let extraChance = false;

const startButton = document.getElementById('startButton');
const validateButton = document.getElementById('validateButton');
const repeatButton = document.getElementById('repeatButton'); // Nuevo botón para repetir
const resultDisplay = document.getElementById('result');
const correctWordDisplay = document.getElementById('correctWord');
const userWordDisplay = document.getElementById('userWord');
const livesDisplay = document.getElementById('lives');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US'; // Aseguramos que el reconocimiento de voz esté en inglés

const synth = window.speechSynthesis;

recognition.onstart = () => {
  recognizing = true;
  startButton.textContent = 'Listening...';
};

recognition.onend = () => {
  recognizing = false;
  startButton.textContent = 'Start';
};

recognition.onresult = (event) => {
  interim_transcript = '';
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      interim_transcript += event.results[i][0].transcript;
    }
  }
};

startButton.addEventListener('click', () => {
  if (recognizing) {
    recognition.stop();
    return;
  }
  getNextWord();
});

validateButton.addEventListener('click', () => {
  if (!validateButton.disabled) {
    recognition.stop();
    validateWord();
  }
});

repeatButton.addEventListener('click', () => {
  if (!repeatButton.disabled) {
    recognition.stop();
    repeatWord();
  }
});

function validateWord() {
  const wordsArray = interim_transcript.trim().split(' ');
  const spelledWord = wordsArray.join('').trim().toLowerCase();

  if (spelledWord === currentWord) {
    resultDisplay.textContent = 'Correct!';
    speakResult('Correct!');
  } else {
    resultDisplay.textContent = 'Incorrect.';
    correctWordDisplay.textContent = `Correct word: ${currentWord}`;
    userWordDisplay.textContent = `Your word: ${interim_transcript}`;
    spellWord(currentWord);
    loseLife();
    showRepeatButton(); // Mostrar el botón "Repeat" para intentar de nuevo
  }
}

function repeatWord() {
  hideRepeatButton(); // Ocultar el botón "Repeat"
  resultDisplay.textContent = '';
  correctWordDisplay.textContent = '';
  userWordDisplay.textContent = '';
  speakWord(currentWord);
  recognition.start();
}

function getNextWord() {
  hideRepeatButton(); // Ocultar el botón "Repeat"
  resultDisplay.textContent = '';
  correctWordDisplay.textContent = '';
  userWordDisplay.textContent = '';
  if (lives <= 0 && !extraChance) {
    extraChance = true;
    lives = 1;
    updateLivesDisplay();
    speakResult('One last chance! Here is your word.');
  } else if (lives <= 0 && extraChance) {
    gameOver();
    return;
  }
  currentWord = words[Math.floor(Math.random() * words.length)];
  speakWord(currentWord);
  recognition.start();
}

function speakWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US'; // Aseguramos que la síntesis de voz esté en inglés
  synth.speak(utterance);
}

function speakResult(result) {
  const utterance = new SpeechSynthesisUtterance(result);
  utterance.lang = 'en-US'; // Aseguramos que la síntesis de voz esté en inglés
  synth.speak(utterance);
}

function spellWord(word) {
  const letters = word.split('').join(', ');
  const utterance = new SpeechSynthesisUtterance(`The correct spelling is: ${letters}`);
  utterance.lang = 'en-US'; // Aseguramos que la síntesis de voz esté en inglés
  synth.speak(utterance);
}

function loseLife() {
  lives--;
  updateLivesDisplay();
}

function updateLivesDisplay() {
  livesDisplay.innerHTML = '';
  for (let i = 0; i < lives; i++) {
    const heart = document.createElement('span');
    heart.textContent = '??';
    heart.className = 'heart';
    livesDisplay.appendChild(heart);
  }
}

function showRepeatButton() {
  repeatButton.disabled = false;
  repeatButton.style.display = 'inline-block';
}

function hideRepeatButton() {
  repeatButton.disabled = true;
  repeatButton.style.display = 'none';
}

function gameOver() {
  resultDisplay.textContent = 'GAME OVER';
  speakResult('GAME OVER');
  startButton.textContent = 'Start';
  startButton.disabled = true;
  recognition.stop();
}

updateLivesDisplay();
hideRepeatButton(); // Iniciar ocultando el botón "Repeat"
