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

document.addEventListener("DOMContentLoaded", () => {
  const midiTypeRadios = document.querySelectorAll("input[name='midiType']");
  const organSettings = document.getElementById("organ-settings");

  midiTypeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "organ" && radio.checked) {
        organSettings.classList.remove("hidden");
      } else if (radio.value === "piano" && radio.checked) {
        organSettings.classList.add("hidden");
      }
    });
  });

  // MIDI channel mapping logic
  let organChannelMap = {
    great: 1,
    swell: 3,
    pedal: 4
  };

  document.getElementById("organ-great").addEventListener("change", e => {
    organChannelMap.great = parseInt(e.target.value);
  });
  document.getElementById("organ-swell").addEventListener("change", e => {
    organChannelMap.swell = parseInt(e.target.value);
  });
  document.getElementById("organ-pedal").addEventListener("change", e => {
    organChannelMap.pedal = parseInt(e.target.value);
  });

  // Hook into existing MIDI input
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(midiAccess => {
      for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = msg => {
          const [status, note, velocity] = msg.data;
          const channel = status & 0x0f; // MIDI channels 0–15
          const type = status & 0xf0;

          // Find which manual this belongs to
          if (type === 0x90 && velocity > 0) {
            if (channel + 1 === organChannelMap.great) {
              console.log(`Great note ON: ${note}`);
            } else if (channel + 1 === organChannelMap.swell) {
              console.log(`Swell note ON: ${note}`);
            } else if (channel + 1 === organChannelMap.pedal) {
              console.log(`Pedal note ON: ${note}`);
            }
          } else if (type === 0x80 || (type === 0x90 && velocity === 0)) {
            // Note off
            if (channel + 1 === organChannelMap.great) {
              console.log(`Great note OFF: ${note}`);
            }
          }
        };
      }
    });
  }
});
