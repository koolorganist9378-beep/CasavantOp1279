let savedPresets = JSON.parse(localStorage.getItem("organPresets")) || {};
const presetButtons = document.querySelectorAll(".preset-btn");
const setBtn = document.getElementById("set-btn");
const cancelBtn = document.getElementById("cancel-btn");
const clearBtn = document.getElementById("clear-btn");

// Restore SET mode state
let setMode = localStorage.getItem("setMode") === "true";
setBtn.classList.toggle("active", setMode);

// Restore currently active preset (if any)
let currentPreset = localStorage.getItem("currentPreset");
if (currentPreset) {
  const activeBtn = document.querySelector(`[data-preset="${currentPreset}"]`);
  if (activeBtn) activeBtn.classList.add("active");
}

// Toggle SET mode
setBtn.addEventListener("click", () => {
  setMode = !setMode;
  localStorage.setItem("setMode", setMode);
  setBtn.classList.toggle("active", setMode);
});

// CANCEL — turn off everything
cancelBtn.addEventListener("click", () => {
  // Clear stop and coupler states
  localStorage.setItem("stopStates", JSON.stringify({}));
  localStorage.setItem("couplerStates", JSON.stringify({}));

  // Turn off SET mode
  setMode = false;
  localStorage.setItem("setMode", "false");
  setBtn.classList.remove("active");

  // Unlight all preset pistons
  presetButtons.forEach(b => b.classList.remove("active"));
  localStorage.removeItem("currentPreset"); // reset current preset indicator

  // Optional cancel flash
  cancelBtn.classList.add("flash");
  setTimeout(() => cancelBtn.classList.remove("flash"), 300);

  alert("🛑 General Cancel: All stops, couplers, and pistons are OFF.");
});

// Handle presets (save and recall)
presetButtons.forEach(btn => {
  const num = btn.dataset.preset;

  btn.addEventListener("click", () => {
    if (setMode) {
      // Save preset
      const stopStates = JSON.parse(localStorage.getItem("stopStates")) || {};
      const couplerStates = JSON.parse(localStorage.getItem("couplerStates")) || {};
      savedPresets[num] = { stopStates, couplerStates };
      localStorage.setItem("organPresets", JSON.stringify(savedPresets));

      alert(`💾 Preset ${num} saved!`);
    } else {
      // Recall preset
      const preset = savedPresets[num];
      if (!preset) return alert(`No data saved for Preset ${num}.`);

      // Apply preset
      localStorage.setItem("stopStates", JSON.stringify(preset.stopStates || {}));
      localStorage.setItem("couplerStates", JSON.stringify(preset.couplerStates || {}));

      // Visually update buttons
      presetButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      localStorage.setItem("currentPreset", num);

      alert(`🎹 Preset ${num} loaded!`);
    }
  });
});