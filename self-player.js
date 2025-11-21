const pdfInput = document.getElementById("pdfInput");
const playBtn = document.getElementById("playBtn");
const scoreDiv = document.getElementById("score");

let osmd;
let currentMidiData = null;

pdfInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // STEP 1: Upload PDF to converter (free API)
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.audiveris.org/convert", {
        method: "POST",
        body: formData
    });

    const xmlText = await res.text();

    // STEP 2: Display MusicXML using OpenSheetMusicDisplay
    osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(scoreDiv);
    await osmd.load(xmlText);
    osmd.render();

    // STEP 3: Convert to MIDI
    currentMidiData = await convertMusicXMLtoMIDI(xmlText);

    playBtn.disabled = false;
});

// Simple MusicXML → MIDI converter (JS version)
async function convertMusicXMLtoMIDI(xml) {
    const response = await fetch("https://melody-api.onrender.com/xml-to-midi", {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xml
    });
    return await response.arrayBuffer();
}

// PLAY using WebMIDI → Your organ engine receives MIDI data
playBtn.addEventListener("click", async () => {
    if (!currentMidiData) return;

    const midi = new Uint8Array(currentMidiData);
    const output = await getMIDIOutput();

    let i = 0;
    const interval = setInterval(() => {
        if (i >= midi.length) {
            clearInterval(interval);
            return;
        }
        output.send([midi[i], midi[i+1] || 0, midi[i+2] || 64]);
        i += 3;
    }, 200); // adjust tempo
});

// Get the first MIDI output (your organ)
async function getMIDIOutput() {
    const access = await navigator.requestMIDIAccess();
    let output;
    access.outputs.forEach(o => output = o);
    return output;
}

function applyPreset(presetName) {

    const selectedStops = presets[presetName];

    // Save to localStorage
    localStorage.setItem("activeStops", JSON.stringify(selectedStops));

    // Optional: redirect to stopjamb
    window.location.href = "stopjamb.html";
}
