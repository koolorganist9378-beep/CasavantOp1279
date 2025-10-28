// Load saved manual states and names
window.addEventListener('load', () => {
  const manuals = ['great', 'swell', 'choir', 'pedal'];
  manuals.forEach(manual => {
    const active = localStorage.getItem(`${manual}-active`);
    const name = localStorage.getItem(`${manual}-name`);

    if (active !== null) {
      document.getElementById(`${manual}-active`).checked = active === 'true';
    }
    if (name !== null) {
      document.getElementById(`${manual}-name`).value = name;
    }

    document.getElementById(`${manual}-active`).addEventListener('change', (e) => {
      localStorage.setItem(`${manual}-active`, e.target.checked);
    });

    document.getElementById(`${manual}-name`).addEventListener('input', (e) => {
      localStorage.setItem(`${manual}-name`, e.target.value);
    });
  });
});
