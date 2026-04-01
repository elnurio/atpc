const video = document.getElementById('heroVideo');
const title = document.getElementById('heroTitle');

video.addEventListener('ended', () => {
  title.classList.add('visible');
});
