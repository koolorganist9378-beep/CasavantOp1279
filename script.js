document.querySelectorAll('.stop').forEach(stop => {
  stop.addEventListener('click', () => {
    stop.classList.toggle('active');
  });
});