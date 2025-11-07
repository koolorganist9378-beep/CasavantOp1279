function createKeyboard(containerId, octaves = 3) {
  const keyboard = document.getElementById(containerId);
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackPositions = [0.7, 1.7, 3.2, 4.2, 5.2]; // relative white key positions per octave
  const whiteKeyWidth = 40;

  // Create white keys
  for (let o = 0; o < octaves; o++) {
    whiteNotes.forEach(note => {
      const w = document.createElement('div');
      w.classList.add('key-white');
      w.dataset.note = `${note}${o + 2}`;
      keyboard.appendChild(w);
    });
  }

  // Create black keys
  for (let o = 0; o < octaves; o++) {
    blackPositions.forEach((pos, i) => {
      const b = document.createElement('div');
      b.classList.add('key-black');
      b.dataset.note = `${['C#','D#','F#','G#','A#'][i]}${o + 2}`;
      b.style.left = `${(o * 7 + pos) * whiteKeyWidth}px`;
      keyboard.appendChild(b);
    });
  }
}

// Create manual
createKeyboard('manual1', 4);

// Create pedalboard (simplified)
const pedal = document.getElementById('pedal');
for (let i = 0; i < 30; i++) {
  const key = document.createElement('div');
  key.classList.add('key-white');
  pedal.appendChild(key);
}
