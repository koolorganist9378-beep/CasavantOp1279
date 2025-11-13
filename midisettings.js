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
  const modal = document.getElementById("midi-startup-modal");
  const organSettings = document.getElementById("organ-settings");
  const manualAssignment = document.getElementById("manual-assignment");

  // Hide all settings initially
  organSettings.classList.add("hidden");
  manualAssignment.classList.add("hidden");

  // Button actions in modal
  document.getElementById("choose-piano").addEventListener("click", () => {
    modal.style.display = "none";
    manualAssignment.classList.remove("hidden");
  });

  document.getElementById("choose-organ").addEventListener("click", () => {
    modal.style.display = "none";
    organSettings.classList.remove("hidden");
    manualAssignment.classList.remove("hidden");
  });

  // ... your existing MIDI detection and channel logic remains here ...
});


document.addEventListener("DOMContentLoaded", () => {
  const midiTypeRadios = document.querySelectorAll("input[name='midiType']");
  const organSettings = document.getElementById("organ-settings");
  const manualAssignment = document.getElementById("manual-assignment");

  // Detect MIDI inputs (for manual assignment)
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(midiAccess => {
      const inputs = Array.from(midiAccess.inputs.values());
      const selects = [
        document.getElementById("piano-choir"),
        document.getElementById("piano-great"),
        document.getElementById("piano-swell"),
        document.getElementById("piano-pedal"),
      ];
      inputs.forEach(input => {
        selects.forEach(sel => {
          const option = document.createElement("option");
          option.value = input.id;
          option.textContent = input.name;
          sel.appendChild(option);
        });
      });
    });
  }

  // Show/Hide sections based on mode
  midiTypeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "organ" && radio.checked) {
        organSettings.classList.remove("hidden");
        manualAssignment.classList.remove("hidden");
      } else if (radio.value === "piano" && radio.checked) {
        organSettings.classList.add("hidden");
        manualAssignment.classList.remove("hidden");
      }
    });
  });

  // Organ MIDI channel mapping
  let organChannelMap = {
    choir: 2,
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
  document.getElementById("organ-choir").addEventListener("change", e => {
    organChannelMap.choir = parseInt(e.target.value);
  });
  document.getElementById("organ-pedal").addEventListener("change", e => {
    organChannelMap.pedal = parseInt(e.target.value);
  });
});
