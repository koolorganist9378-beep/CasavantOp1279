// ----- Organ stop button toggling with memory -----
const savedStops = JSON.parse(localStorage.getItem("stopStates")) || {};
const stopButtons = document.querySelectorAll(".stop");

// Apply saved states when page loads
stopButtons.forEach((btn) => {
  const name = btn.textContent.trim();
  if (savedStops[name]) {
    btn.classList.add("active");
  }

  // Add click listener
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const isActive = btn.classList.contains("active");
    savedStops[name] = isActive;
    localStorage.setItem("stopStates", JSON.stringify(savedStops));
  });
});

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const sampleCache = new Map();
const activeVoices = new Map(); // key = midiNote

async function loadSample(midiNote) {
    if (sampleCache.has(midiNote)) return sampleCache.get(midiNote);

    const url = `samples/${String(midiNote).padStart(3, '0')}.wav`;
    const response = await fetch(url);
    if (!response.ok) {
        console.warn("Missing sample:", url);
        return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    sampleCache.set(midiNote, audioBuffer);
    return audioBuffer;
}

async function noteOn(midiNote, velocity = 127) {
    const buffer = await loadSample(midiNote);
    if (!buffer) return;

    const source = audioCtx.createBufferSource();
    const gainNode = audioCtx.createGain();

    gainNode.gain.value = velocity / 127;

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    source.start();

    activeVoices.set(midiNote, { source, gainNode });
}

function noteOff(midiNote) {
    const voice = activeVoices.get(midiNote);
    if (!voice) return;

    const { source, gainNode } = voice;

    const now = audioCtx.currentTime;
    gainNode.gain.setTargetAtTime(0.0001, now, 0.03);

    setTimeout(() => {
        source.stop();
    }, 61);

    activeVoices.delete(midiNote);
}

// MAIN MIDI HANDLER
function handleMIDIMessage(message) {
    const [status, note, velocity] = message.data;
    const type = status & 0xf0;
    midiInput.onmidimessage = handleMIDIMessage;

    if (type === 0x90 && velocity > 0) {  
        noteOn(note, velocity);
    } else if (type === 0x80 || (type === 0x90 && velocity === 0)) { 
        noteOff(note);
    }
}
