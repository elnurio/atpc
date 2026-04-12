const video = document.getElementById('heroVideo');
const title = document.getElementById('heroTitle');
const audio = document.getElementById('heroAudio');
let soundtrackEnabled = true;
let autoplayBlocked = false;

function syncAudioToVideo() {
  if (!audio || !video) return;
  if (audio.readyState === 0) return;
  if (!Number.isFinite(video.currentTime)) return;
  if (Math.abs(audio.currentTime - video.currentTime) > 0.35) {
    audio.currentTime = video.currentTime;
  }
}

function pauseSoundtrack() {
  if (!audio) return;
  audio.pause();
}

function playSoundtrack() {
  if (!audio || !soundtrackEnabled) return;
  syncAudioToVideo();
  const playback = audio.play();
  if (playback && typeof playback.catch === 'function') {
    playback.catch(() => {
      autoplayBlocked = true;
    });
  }
}

function tryUnlockSoundtrack() {
  if (!autoplayBlocked) return;
  autoplayBlocked = false;
  playSoundtrack();
}

video.addEventListener('ended', () => {
  pauseSoundtrack();
  title.classList.add('visible');
});

video.addEventListener('play', playSoundtrack);
video.addEventListener('pause', pauseSoundtrack);
video.addEventListener('seeking', syncAudioToVideo);
video.addEventListener('seeked', syncAudioToVideo);
video.addEventListener('timeupdate', syncAudioToVideo);
audio.addEventListener('loadedmetadata', syncAudioToVideo);
video.addEventListener('ratechange', () => {
  if (!audio) return;
  audio.playbackRate = video.playbackRate || 1;
});
window.addEventListener('load', playSoundtrack);
document.addEventListener('pointerdown', tryUnlockSoundtrack);
document.addEventListener('touchstart', tryUnlockSoundtrack, { passive: true });
document.addEventListener('keydown', tryUnlockSoundtrack);
