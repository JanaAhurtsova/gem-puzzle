export const toggleHamburger = (
  hamburger,
  hamburgerLine,
  buttonsContainer,
  overlay,
  body
) => {
  hamburger.classList.toggle("active");
  hamburgerLine.classList.toggle("active");
  buttonsContainer.classList.toggle("active");
  overlay.classList.toggle("active");
  body.classList.add("lock");
};

export const closeBurger = (
  hamburger,
  hamburgerLine,
  buttonsContainer,
  overlay,
  body
) => {
  hamburger.classList.remove("active");
  hamburgerLine.classList.remove("active");
  buttonsContainer.classList.remove("active");
  overlay.classList.remove("active");
  body.classList.remove("lock");
};
