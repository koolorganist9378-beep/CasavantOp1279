// --- Generate Keyboard Layouts ---
const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackKeyOffsets = [1, 2, 4, 5, 6]; // For C#, D#, F#, G#, A#

function createKeyboard(containerId, numOctaves = 5) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  for (let i = 0; i < numOctaves; i++) {
    whiteKeys.forEach((note, index) => {
      const key = document.createElement('div');
      key.classList.add('key');
      key.dataset.note = note + (i + 1);
      container.appendChild(key);

      if (!['E', 'B'].includes(note)) {
        const black = document.createElement('div');
        black.classList.add('key', 'black');
        black.dataset.note = note + '#' + (i + 1);
        black.style.left = `${(index * 16) + 12 + (i * 7 * 16)}px`;
        container.appendChild(black);
      }
    });
  }
}

// Create manuals visually
['great', 'swell', 'choir', 'pedal'].forEach(m => {
  createKeyboard(`${m}-keyboard`, m === 'pedal' ? 2 : 5);
});

// --- Couplers ---
const couplers = ['swell-to-great', 'choir-to-great', 'great-to-pedal', 'swell-to-pedal'];

// Load saved coupler settings
window.addEventListener('load', () => {
  couplers.forEach(id => {
    const checkbox = document.getElementById(id);
    const saved = localStorage.getItem(id);
    if (saved) checkbox.checked = saved === 'true';

    checkbox.addEventListener('change', (e) => {
      localStorage.setItem(id, e.target.checked);
    });
  });
});

