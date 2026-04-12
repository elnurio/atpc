const video = document.getElementById('heroVideo');
const title = document.getElementById('heroTitle');
const audio = document.getElementById('heroAudio');
const soundToggle = document.getElementById('soundToggle');

let soundtrackEnabled = false;

function updateSoundToggle() {
  if (!soundToggle) return;
  soundToggle.classList.toggle('is-on', soundtrackEnabled);
  soundToggle.setAttribute('aria-pressed', String(soundtrackEnabled));
  soundToggle.textContent = soundtrackEnabled ? 'sound on' : 'tap for sound';
  soundToggle.setAttribute(
    'aria-label',
    soundtrackEnabled ? 'Disable soundtrack' : 'Enable soundtrack'
  );
}

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
      soundtrackEnabled = false;
      updateSoundToggle();
    });
  }
}

function setSoundtrackEnabled(enabled) {
  soundtrackEnabled = enabled;
  updateSoundToggle();

  if (!soundtrackEnabled) {
    pauseSoundtrack();
    return;
  }

  playSoundtrack();
}

function unlockSoundtrackFromGesture() {
  if (soundtrackEnabled) return;
  setSoundtrackEnabled(true);
}

updateSoundToggle();

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

if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    setSoundtrackEnabled(!soundtrackEnabled);
  });
}

document.addEventListener('pointerdown', unlockSoundtrackFromGesture, { once: true });
document.addEventListener('keydown', unlockSoundtrackFromGesture, { once: true });
