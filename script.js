const video = document.getElementById('heroVideo');
const title = document.getElementById('heroTitle');
const audio = document.getElementById('heroAudio');
const tapHint = document.getElementById('tapHint');
let autoplayBlocked = false;
let soundtrackUnlocked = false;

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

function playSoundtrackMuted() {
  if (!audio) return;
  audio.muted = true;
  syncAudioToVideo();
  const playback = audio.play();
  if (playback && typeof playback.catch === 'function') {
    playback.catch(() => {
      autoplayBlocked = true;
    });
  }
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
  hideTapHint();
  playSoundtrackAudible();
}

video.addEventListener('ended', () => {
  pauseSoundtrack();
  title.classList.add('visible');
});

video.addEventListener('play', () => {
  if (soundtrackUnlocked) {
    playSoundtrackAudible();
    return;
  }
  playSoundtrackMuted();
});
video.addEventListener('pause', pauseSoundtrack);
video.addEventListener('seeking', syncAudioToVideo);
video.addEventListener('seeked', syncAudioToVideo);
video.addEventListener('timeupdate', syncAudioToVideo);
audio.addEventListener('loadedmetadata', syncAudioToVideo);
video.addEventListener('ratechange', () => {
  if (!audio) return;
  audio.playbackRate = video.playbackRate || 1;
});
window.addEventListener('load', playSoundtrackMuted);
document.addEventListener('pointerdown', unlockSoundtrack);
document.addEventListener('touchstart', unlockSoundtrack, { passive: true });
document.addEventListener('keydown', unlockSoundtrack);
