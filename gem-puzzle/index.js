import { toggleHamburger, closeBurger } from "./js/burger.js";
import {
  getMatrix,
  isValidForSwap,
  swap,
  findCoordinatesByNum,
  randomShuffle,
  isSolvable,
  isWin,
} from "./js/helper.js";
import { generateResults } from "./js/result.js";
import { setLocalStorage } from "./js/save.js";
import { setMute } from "./js/sound.js";
import { generateWinCard } from "./js/win.js";
//create layout
const body = document.querySelector("body");

const overlay = document.createElement("div");
overlay.classList.add("overlay");

const header = document.createElement("div");
header.classList.add("header");

const headerWrapper = document.createElement("div");
headerWrapper.classList.add("header__wrapper");
header.append(headerWrapper);

const hamburger = document.createElement("span");
hamburger.classList.add("hamburger");

const hamburgerLine = document.createElement("span");
hamburgerLine.classList.add("hamburger__line");
hamburger.append(hamburgerLine);

const wrapper = document.createElement("div");
wrapper.classList.add("wrapper");
body.append(header, wrapper, overlay);

const buttonsContainer = document.createElement("div");
buttonsContainer.classList.add("buttons__container");
headerWrapper.append(buttonsContainer, hamburger);

const shuffleBtn = document.createElement("button");
shuffleBtn.classList.add("button");
shuffleBtn.textContent = "Shuffle and Start";

const pauseBtn = document.createElement("button");
pauseBtn.classList.add("button");
pauseBtn.textContent = "Pause";

const saveBtn = document.createElement("button");
saveBtn.classList.add("button");
saveBtn.textContent = "Save";

const resultBtn = document.createElement("button");
resultBtn.classList.add("button");
resultBtn.textContent = "Result";
buttonsContainer.append(shuffleBtn, pauseBtn, saveBtn, resultBtn);

const gameProcess = document.createElement("div");
gameProcess.classList.add("game__process");

const move = document.createElement("span");
move.classList.add("text");
move.textContent = "Move: ";

const moveNum = document.createElement("span");
moveNum.classList.add("text");
moveNum.textContent = localStorage.getItem("move") ?? "0";
move.append(moveNum);

const volume = document.createElement("div");
volume.classList.add("volume");

const time = document.createElement("span");
time.classList.add("text");
time.textContent = "Time: ";
gameProcess.append(move, volume, time);

const timeNum = document.createElement("span");
timeNum.classList.add("text");
timeNum.textContent = localStorage.getItem("time") ?? "00:00";
time.append(timeNum);

const audio = document.createElement("audio");
audio.setAttribute("src", "assets/drop_sound.mp3");

const frame = document.createElement("div");
frame.classList.add("frame");

const frameSize = document.createElement("span");
frameSize.classList.add("frame__size");

const sizeContainer = document.createElement("div");
sizeContainer.classList.add("choose__size");

const otherSizes = document.createElement("span");
otherSizes.classList.add("sizes");
otherSizes.textContent = "Other sizes:";

const audioWin = document.createElement("audio");
audioWin.setAttribute("src", "assets/win.mp3");
wrapper.append(gameProcess, frame, frameSize, otherSizes, sizeContainer);

const size3 = document.createElement("span");
const size4 = document.createElement("span");
const size5 = document.createElement("span");
const size6 = document.createElement("span");
const size7 = document.createElement("span");
const size8 = document.createElement("span");
sizeContainer.append(size3, size4, size5, size6, size7, size8);

const wonCard = document.createElement("div");
wonCard.className = "won";

const sizes = [size3, size4, size5, size6, size7, size8];

for (let i = 0; i < sizes.length; i++) {
  sizes[i].dataset.id = i + 3;
  sizes[i].className = "size";
  sizes[i].textContent = `${i + 3}x${i + 3}`;
}

if (localStorage.getItem("size")) {
  sizes[+localStorage.getItem("size") - 3].className += " active";
} else {
  size4.className += " active";
}

let selected;
let selectedSize;
changeSize();
let count = +localStorage.getItem("move") ?? 0;
let seconds = localStorage.getItem("time")
  ? +localStorage.getItem("time").slice(-2)
  : 0;
let minutes = localStorage.getItem("time")
  ? +localStorage.getItem("time").slice(0, 2)
  : 0;
let interval = null;
const emptyNumber = 0;
const cells = [];
const wins = JSON.parse(localStorage.getItem('result')) ?? [];
let countTile = selectedSize * selectedSize;
createTiles();
let cellsArr = cells.map((cell) => Number(cell.dataset.id));
let matrix = getMatrix(cellsArr, selectedSize);
let isGame = false;

function changeSize() {
  for (let i = 0; i < sizes.length; i++) {
    if (sizes[i].classList.contains("active")) {
      selectedSize = Number(sizes[i].dataset.id);
      frameSize.textContent = `Frame size: ${selectedSize}x${selectedSize}`;
    }
  }
}

//create tiles
function createTiles() {
  for (let i = 0; i < selectedSize * selectedSize; i++) {
    const cell = document.createElement("button");
    cell.classList.add("cell");
    cell.setAttribute("id", i);
    cell.dataset.id = i;
    frame.append(cell);

    const num = document.createElement("span");
    cell.textContent = i;
    cell.append(num);

    if (cell.textContent === `0`) {
      cell.style.display = "none";
    }
    cell.style.width = `${
      (frame.offsetWidth * 100) / frame.offsetWidth / selectedSize
    }%`;
    cell.style.height = `${
      (frame.offsetWidth * 100) / frame.offsetWidth / selectedSize - 0.2
    }% `;

    cells.push(cell);
  }
}

if (cells.length != countTile) {
  throw new Error(`Must be ${countTile} cells`);
}

function setPositionCells(matrix) {
  for (let y = 0; y < selectedSize; y++) {
    for (let x = 0; x < selectedSize; x++) {
      const value = matrix[y][x];
      const cell = cells[value];
      const shiftPos = 100;
      cell.style.transform = `translate(${x * shiftPos}%, ${y * shiftPos}%)`;
    }
  }
}

function shuffle() {
  moveNum.textContent = "0";
  count = 0;
  resetTimer();
  shuffledField();
  closeBurger(hamburger, hamburgerLine, buttonsContainer, overlay, body);
}

//shuffle tiles
function shuffledField() {
  const shuffleArr = randomShuffle(matrix.flat());
  matrix = getMatrix(shuffleArr, selectedSize);
  setPositionCells(matrix);

  startTimer();
  if (!isSolvable(matrix, selectedSize)) {
    shuffledField();
  }
  frame.addEventListener("click", game);
}

if (localStorage.getItem("matrix")) {
  matrix = JSON.parse(localStorage.getItem("matrix"));
  setPositionCells(matrix);
  startTimer();
} else {
  shuffledField();
}

if (localStorage.getItem("mute")) {
  audio.muted = JSON.parse(localStorage.getItem("mute"));
  if (audio.muted) {
    volume.classList.add("mute");
    audio.pause();
  } else {
    volume.classList.remove("mute");
  }
} else {
  volume.classList.remove("mute");
}

function game(event) {
  const cell = event.target.closest("button");
  if (!cell) {
    return;
  }

  audio.play();

  const cellNum = Number(cell.dataset.id);
  const cellCoords = findCoordinatesByNum(cellNum, matrix);
  const blankCoords = findCoordinatesByNum(emptyNumber, matrix);
  const isValidSwap = isValidForSwap(cellCoords, blankCoords);

  if (isValidSwap) {
    swap(cellCoords, blankCoords, matrix);
    setPositionCells(matrix);
    count++;
    moveNum.textContent = `${count}`;
    if (isWin(matrix, countTile)) {
      frame.removeEventListener("click", game);
      stopTimer();
      setTimeout(() => {
        generateWinCard(body, audioWin, moveNum, timeNum, wins);
      }, 500);
    }
  }
}

//create timer
function timer() {
  seconds++;

  let secs = seconds % 60;
  let mins = minutes + Math.floor(seconds / 60);
  if (secs < 10) secs = "0" + secs;
  if (mins < 10) mins = "0" + mins;

  timeNum.innerText = `${mins}:${secs}`;
}

function startTimer() {
  if (interval) {
    return;
  }
  interval = setInterval(timer, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  timeNum.textContent = "00:00";
}

//change size
sizeContainer.addEventListener("click", (event) => {
  sizes.forEach((size) => size.classList.remove("active"));
  let size = event.target.closest("span");
  if (!size) return;
  activeSize(size);
  frame.innerHTML = "";
  cells.length = 0;
  changeSize();
  createTiles();
  cellsArr = cells.map((cell) => Number(cell.dataset.id));
  matrix = getMatrix(cellsArr, selectedSize);
  countTile = selectedSize * selectedSize;
  setPositionCells(matrix);
  shuffledField();
  frameSize.textContent = `Frame size: ${selectedSize}x${selectedSize}`;
});

function activeSize(size) {
  if (selected) {
    selected.classList.remove("active");
  }
  selected = size;
  selected.classList.add("active");
}

//buttons
function setPause() {
  if (!isGame) {
    frame.removeEventListener("click", game);
    isGame = true;
    pauseBtn.classList.add("active");
    pauseBtn.textContent = "Continue";
    stopTimer();
  } else {
    frame.addEventListener("click", game);
    isGame = false;
    pauseBtn.classList.remove("active");
    pauseBtn.textContent = "Pause";
    startTimer();
  }
  closeBurger(hamburger, hamburgerLine, buttonsContainer, overlay, body);
}

hamburger.addEventListener("click", () =>
  toggleHamburger(hamburger, hamburgerLine, buttonsContainer, overlay, body)
);
overlay.addEventListener("click", () =>
  closeBurger(hamburger, hamburgerLine, buttonsContainer, overlay, body)
);
saveBtn.addEventListener("click", () => {
  setLocalStorage(matrix, timeNum, moveNum, selectedSize, audio);
  closeBurger(hamburger, hamburgerLine, buttonsContainer, overlay, body);
});
resultBtn.addEventListener("click", () => {
  generateResults(body, wins);
  closeBurger(hamburger, hamburgerLine, buttonsContainer, overlay, body);
});
frame.addEventListener("click", game);
volume.addEventListener("click", () => setMute(audio, volume));
pauseBtn.addEventListener("click", setPause);
shuffleBtn.addEventListener("click", shuffle);
