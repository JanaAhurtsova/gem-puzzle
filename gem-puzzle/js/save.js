export const setLocalStorage = (matrix, timeNum, moveNum, selectedSize, audio) => {
  localStorage.setItem("matrix", JSON.stringify(matrix));
  localStorage.setItem("time", timeNum.textContent);
  localStorage.setItem("move", moveNum.textContent);
  localStorage.setItem("size", JSON.stringify(selectedSize));
  localStorage.setItem("mute", JSON.stringify(audio.muted));
}
