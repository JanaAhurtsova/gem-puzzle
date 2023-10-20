import { sortResults } from "./helper.js";

export const generateResults = (body) => {
  let template = "";
  const overlayResult = document.createElement("div");
  overlayResult.className = "overlay__result";

  template += `<div class='results'>`;
  template += `<p class='results__title'> Best Results </p>`;
  const results = sortResults();
  results.map((result) => {
    return template += `<p> Move: ${result.move} Time: ${result.time}</p>`;
  });
  template += `</div>`;

  body.append(overlayResult);
  overlayResult.innerHTML = template;
  overlayResult.addEventListener("click", closeResults);
}

function closeResults(e) {
  let classes = e.target.classList;
  if (classes.contains("overlay__result")) {
    document.querySelector(".overlay__result").remove();
  }
}
