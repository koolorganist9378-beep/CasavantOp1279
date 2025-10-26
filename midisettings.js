let midiAccess = null;
let selectedInput = null;
let selectedManual = localStorage.getItem('selectedManual') || 'great';
let savedInputId = localStorage.getItem('selectedInputId');

// Request MIDI access
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
  alert("Your browser does not support Web MIDI API.");
}

function onMIDISuccess(access) {
  midiAccess = access;
  const inputSelect = document.getElementById('midiInputSelect');
  inputSelect.innerHTML = '';

  // Populate MIDI devices
  for (let input of midiAccess.inputs.values()) {
    const option = document.createElement('option');
    option.value = input.id;
    option.textContent = input.name;
    inputSelect.appendChild(option);
  }

  // Restore saved device if available
  if (savedInputId && midiAccess.inputs.has(savedInputId)) {
    inputSelect.value = savedInputId;
    selectedInput = midiAccess.inputs.get(savedInputId);
    selectedInput.onmidimessage = handleMIDIMessage;
  } else if (midiAccess.inputs.size > 0) {
    selectedInput = midiAccess.inputs.values().next().value;
    inputSelect.value = selectedInput.id;
    selectedInput.onmidimessage = handleMIDIMessage;
  }

  // Save new device on change
  inputSelect.addEventListener('change', () => {
    const id = inputSelect.value;
    selectedInput = midiAccess.inputs.get(id);
    selectedInput.onmidimessage = handleMIDIMessage;
    localStorage.setItem('selectedInputId', id);
  });
}

function onMIDIFailure() {
  console.error('Failed to access MIDI devices.');
}

// Handle manual selector
const manualSelect = document.getElementById('manualSelect');
manualSelect.value = selectedManual;

manualSelect.addEventListener('change', (e) => {
  selectedManual = e.target.value;
  localStorage.setItem('selectedManual', selectedManual);
  console.log(`MIDI assigned to ${selectedManual} manual`);
});

// Handle incoming MIDI
function handleMIDIMessage(event) {
  const [command, note, velocity] = event.data;

  if (command >= 144 && command < 160 && velocity > 0) {
    playNoteOnManual(note, velocity, selectedManual);
  } else if ((command >= 128 && command < 144) || (command >= 144 && velocity === 0)) {
    stopNoteOnManual(note, selectedManual);
  }
}

// Placeholder sound functions
function playNoteOnManual(note, velocity, manual) {
  console.log(`Play note ${note} (vel ${velocity}) on ${manual}`);
}

function stopNoteOnManual(note, manual) {
  console.log(`Stop note ${note} on ${manual}`);
}
