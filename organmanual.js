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

    document.addEventListener("DOMContentLoaded", () => {
  const whitePattern = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B
  const blackPattern = [1, 3, 6, 8, 10];       // C#, D#, F#, G#, A#

  document.querySelectorAll(".keyboard").forEach(kb => {
    const isPedal = kb.classList.contains("pedal");
    const numKeys = isPedal ? 32 : 61;

    // Create white keys
    for (let i = 0; i < numKeys; i++) {
      const white = document.createElement("div");
      white.classList.add("white-key");
      kb.appendChild(white);
    }

    // Position black keys manually
    const whiteKeys = kb.querySelectorAll(".white-key");
    whiteKeys.forEach((w, i) => {
      const note = i % 7; // pattern repeats every 7 whites
      // skip placing black keys after E (note 2) and B (note 6)
      if (note !== 2 && note !== 6) {
        const black = document.createElement("div");
        black.classList.add("black-key");
        // offset black keys between whites
        black.style.left = `${i * 21 + 14}px`;
        kb.appendChild(black);
      }
    });
  });
});