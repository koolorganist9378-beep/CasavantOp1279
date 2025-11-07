let savedPresets = JSON.parse(localStorage.getItem("organPresets")) || {};
const presetButtons = document.querySelectorAll(".preset-btn");
const setBtn = document.getElementById("set-btn");
const cancelBtn = document.getElementById("cancel-btn");

// Restore Set state
let setMode = localStorage.getItem("setMode") === "true";
setBtn.classList.toggle("active", setMode);

// Toggle SET mode
setBtn.addEventListener("click", () => {
  setMode = !setMode;
  localStorage.setItem("setMode", setMode);
  setBtn.classList.toggle("active", setMode);
});

// CANCEL — clear everything visually and logically
cancelBtn.addEventListener("click", () => {
  // Clear active stops/couplers
  localStorage.setItem("stopStates", JSON.stringify({}));
  localStorage.setItem("couplerStates", JSON.stringify({}));

  // Turn off SET mode
  setMode = false;
  localStorage.setItem("setMode", "false");
  setBtn.classList.remove("active");

  // Turn off ALL preset pistons visually
  presetButtons.forEach(b => b.classList.remove("active"));

  // Optional feedback flash (visual realism)
  cancelBtn.classList.add("flash");
  setTimeout(() => cancelBtn.classList.remove("flash"), 300);
});

// Handle preset save/recall
presetButtons.forEach(btn => {
  const num = btn.dataset.preset;

  if (savedPresets[num]) btn.classList.add("active");

  btn.addEventListener("click", () => {
    if (setMode) {
      // Save preset
      const stopStates = JSON.parse(localStorage.getItem("stopStates")) || {};
      const couplerStates = JSON.parse(localStorage.getItem("couplerStates")) || {};
      savedPresets[num] = { stopStates, couplerStates };
      localStorage.setItem("organPresets", JSON.stringify(savedPresets));

      presetButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      alert(`💾 Preset ${num} saved!`);
    } else {
      // Recall preset
      presetButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const preset = savedPresets[num];

      localStorage.setItem("stopStates", JSON.stringify(preset.stopStates || {}));
      localStorage.setItem("couplerStates", JSON.stringify(preset.couplerStates || {}));
    }
  });
});

