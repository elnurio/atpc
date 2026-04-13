const video = document.getElementById('heroVideo');
const title = document.getElementById('heroTitle');
const audio = document.getElementById('heroAudio');
const tapHint = document.getElementById('tapHint');
let autoplayBlocked = false;
let soundtrackUnlocked = false;
let lastSyncAt = 0;

function syncAudioToVideo() {
  if (!audio || !video) return;
  if (audio.readyState === 0) return;
  if (!Number.isFinite(video.currentTime)) return;
  if (Math.abs(audio.currentTime - video.currentTime) > 0.45) {
    audio.currentTime = video.currentTime;
  }
}

function pauseSoundtrack() {
  if (!audio) return;
  audio.pause();
}

function playSoundtrackAudible() {
  if (!audio) return;
  syncAudioToVideo();
  audio.muted = false;
  const playback = audio.play();
  if (playback && typeof playback.catch === 'function') {
    playback.catch(() => {
      autoplayBlocked = true;
      audio.muted = true;
    });
  }
}

function hideTapHint() {
  if (!tapHint || tapHint.classList.contains('is-hidden')) return;
  tapHint.classList.add('is-hidden');
  window.setTimeout(() => {
    tapHint.remove();
  }, 400);
}

function unlockSoundtrack() {
  if (soundtrackUnlocked || !audio) return;
  soundtrackUnlocked = true;
  autoplayBlocked = false;
  playSoundtrackAudible();
}

function handleTapUnlock() {
  hideTapHint();
  unlockSoundtrack();
}

video.addEventListener('ended', () => {
  pauseSoundtrack();
  title.classList.add('visible');
});

video.addEventListener('play', () => {
  if (!soundtrackUnlocked) return;
  playSoundtrackAudible();
});
video.addEventListener('pause', pauseSoundtrack);
video.addEventListener('seeking', syncAudioToVideo);
video.addEventListener('seeked', syncAudioToVideo);
video.addEventListener('timeupdate', () => {
  if (!soundtrackUnlocked) return;
  const now = performance.now();
  if (now - lastSyncAt < 500) return;
  lastSyncAt = now;
  syncAudioToVideo();
});
audio.addEventListener('loadedmetadata', syncAudioToVideo);
video.addEventListener('ratechange', () => {
  if (!audio) return;
  audio.playbackRate = video.playbackRate || 1;
});
document.addEventListener('pointerdown', handleTapUnlock);
document.addEventListener('touchstart', handleTapUnlock, { passive: true });
document.addEventListener('keydown', unlockSoundtrack);
