export const setMute = (audio, volume) => {
  audio.muted = !audio.muted;
  if (audio.muted) {
    volume.classList.add("mute");
  } else {
    volume.classList.remove("mute");
  }
};
