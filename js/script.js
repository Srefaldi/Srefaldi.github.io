const title = document.querySelector(".title");
const words = title.textContent.split(" ");

title.innerHTML = "";

words.forEach((word, wordIndex) => {
  const wordElement = document.createElement("span");
  wordElement.classList.add("word");

  word.split("").forEach((char, charIndex) => {
    const charElement = document.createElement("span");
    charElement.textContent = char;
    charElement.classList.add("char");

    if (charIndex !== 0) {
      charElement.style.opacity = 0;
    }

    wordElement.appendChild(charElement);
  });

  title.appendChild(wordElement);
});

let currentWordIndex = 0;
let currentCharIndex = 0;
const wordElements = document.querySelectorAll(".word");

function showNextChar() {
  const charElements = wordElements[currentWordIndex].querySelectorAll(".char");
  charElements[currentCharIndex].style.opacity = 1;

  currentCharIndex++;

  if (currentCharIndex >= charElements.length) {
    currentWordIndex = (currentWordIndex + 1) % wordElements.length;
    currentCharIndex = 0;

    setTimeout(() => {
      resetCharOpacity();
      showNextChar();
    }, 1); // Delay antara kata
  }
}

function resetCharOpacity() {
  const charElements = wordElements[currentWordIndex].querySelectorAll(".char");
  charElements.forEach((charElement) => {
    charElement.style.opacity = 0;
  });
}

setInterval(showNextChar, 300); // Ganti huruf setiap 0.2 detik
