export const generateWinCard = (body, audioWin, moveNum, timeNum, wins) => {
  let template = "";
  const overlayWon = document.createElement("div");
  overlayWon.className = "overlay__won";

  template += `<div class='won'>`;
  template += `<span class='won__text'>Hooray! You solved the puzzle in ${timeNum.textContent} and ${moveNum.textContent} moves!</span>`;
  template += `</div>`;

  body.append(overlayWon);
  overlayWon.innerHTML = template;
  overlayWon.addEventListener("click", (e) => closeWinMessage(e, audioWin));
  audioWin.play();
  const result = {
    move: moveNum.textContent,
    time: timeNum.textContent
  };
  wins.push(result);
  localStorage.setItem("result", JSON.stringify(wins));
}

function closeWinMessage(e, audioWin) {
  let classes = e.target.classList;
  if (classes.contains("overlay__won")) {
    document.querySelector(".overlay__won").remove();
    audioWin.pause();
  }
}
