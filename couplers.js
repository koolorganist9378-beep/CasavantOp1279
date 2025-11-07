// ----- Coupler button toggling with memory -----

// Load saved coupler states from localStorage
const savedCouplers = JSON.parse(localStorage.getItem("couplerStates")) || {};

// Find all coupler buttons
const couplerButtons = document.querySelectorAll(".coupler-btn");

// Apply saved states when page loads
couplerButtons.forEach((btn) => {
  const name = btn.textContent.trim();
  if (savedCouplers[name]) {
    btn.classList.add("active");
  }

  // Add click listener to toggle
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const isActive = btn.classList.contains("active");
    savedCouplers[name] = isActive;
    localStorage.setItem("couplerStates", JSON.stringify(savedCouplers));
  });
});

