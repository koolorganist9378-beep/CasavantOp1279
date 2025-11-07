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