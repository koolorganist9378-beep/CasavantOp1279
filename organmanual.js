document.addEventListener("DOMContentLoaded", () => {
  const whiteOrder = [0, 2, 4, 5, 7, 9, 11];
  const blackOrder = [1, 3, 6, 8, 10];

  document.querySelectorAll(".keyboard").forEach(kb => {
    const isPedal = kb.classList.contains("pedal");
    const numKeys = isPedal ? 32 : 61;
    const startMidi = isPedal ? 36 : 36; // adjust later if needed

    for (let i = 0; i < numKeys; i++) {
      const note = (i + startMidi) % 12;
      if (whiteOrder.includes(note)) {
        const white = document.createElement("div");
        white.classList.add("white-key");
        kb.appendChild(white);
      }
    }

    // Add black keys visually positioned between white keys
    const whiteKeys = kb.querySelectorAll(".white-key");
    whiteKeys.forEach((w, i) => {
      const note = (i + startMidi) % 12;
      if ([0,1,3,5,6,8,10].includes(note)) {
        const black = document.createElement("div");
        black.classList.add("black-key");
        black.style.left = `${w.offsetLeft + 15}px`;
        kb.appendChild(black);
      }
    });
  });
});

