/* ==========================================================================
   A UNIVERSE CALLED MAYUR — Cinematic Audio Engine
   Featured Song: "O Mere Dil Ke Chain"
   Original Lyrical Recording by Kishore Kumar • Mere Jeevan Saathi (1972)
   ========================================================================== */

class CinematicAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.masterGain = null;
    this.sfxGain = null;
    this.volume = 0.75;
    this.hasUserInteracted = false;

    // Persistent HTML5 Audio instance for the original lyrical recording
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';
    this.audioElement.loop = true;
    this.audioElement.volume = this.volume;

    // Primary path to the attached original lyrical recording
    this.audioElement.src = 'assets/audio/o_mere_dil_ke_chain.mp3';

    // UI Elements
    this.playPauseBtn = document.getElementById('audio-play-pause-btn');
    this.muteBtn = document.getElementById('audio-mute-btn');
    this.volumeSlider = document.getElementById('audio-volume-slider');
    this.progressBar = document.getElementById('audio-progress-bar');
    this.progressTrack = document.querySelector('.audio-progress-track');
    this.timeDisplay = document.getElementById('audio-time-display');
    this.visualizerBars = document.getElementById('audio-visualizer-bars');
    this.songTitleEl = document.getElementById('audio-song-title');
    this.songArtistEl = document.getElementById('audio-song-artist');

    this.init();
  }

  init() {
    this.updateTrackInfo();

    // Attach UI Listeners
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlayback();
      });
    }

    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMute();
      });
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        this.setVolume(parseFloat(e.target.value));
      });
      this.volumeSlider.addEventListener('click', (e) => e.stopPropagation());
    }

    // Allow scrubbing / seeking by clicking on the progress track
    if (this.progressTrack) {
      this.progressTrack.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = this.progressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
          this.audioElement.currentTime = pct * this.audioElement.duration;
        }
      });
    }

    // Real-time playback progress tracking from the original audio file
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
        this.updateProgressBar(this.audioElement.currentTime, this.audioElement.duration);
      }
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateUI(true);
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateUI(false);
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio playback encountered an issue, retrying secondary path...', e);
      if (this.audioElement.src.indexOf('o_mere_dil_ke_chain.mp3') !== -1) {
        this.audioElement.src = 'assets/audio/background.mp3';
        this.audioElement.load();
      }
    });

    // Auto-unlock Web Audio context & audio engine on first user interaction
    const unlockUserAudio = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        this.ensureContext();
      }
      window.removeEventListener('pointerdown', unlockUserAudio);
      window.removeEventListener('keydown', unlockUserAudio);
    };
    window.addEventListener('pointerdown', unlockUserAudio);
    window.addEventListener('keydown', unlockUserAudio);
  }

  updateTrackInfo() {
    if (this.songTitleEl) {
      this.songTitleEl.textContent = 'O MERE DIL KE CHAIN';
    }
    if (this.songArtistEl) {
      this.songArtistEl.textContent = 'Kishore Kumar • Mere Jeevan Saathi (1972)';
    }
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      this.sfxGain = this.audioCtx.createGain();
      this.sfxGain.gain.setValueAtTime(0.85, this.audioCtx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  togglePlayback() {
    this.ensureContext();
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.ensureContext();
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.updateUI(true);
        })
        .catch((err) => {
          console.log('Playback waiting for user gesture:', err.message);
        });
    }
  }

  pause() {
    this.audioElement.pause();
    this.isPlaying = false;
    this.updateUI(false);
  }

  // Gentle fade-in for the universe creation sequence
  fadeInMusic(targetVolume = 0.75, durationSec = 3.0) {
    this.ensureContext();
    this.audioElement.volume = 0.01;
    this.play();

    let step = 0;
    const steps = 30;
    const interval = (durationSec * 1000) / steps;
    const volumeStep = targetVolume / steps;

    const timer = setInterval(() => {
      step++;
      const nextVol = Math.min(targetVolume, volumeStep * step);
      this.audioElement.volume = nextVol;
      if (step >= steps) {
        clearInterval(timer);
        this.volume = targetVolume;
        if (this.volumeSlider) this.volumeSlider.value = targetVolume;
      }
    }, interval);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audioElement.muted = this.isMuted;

    if (this.muteBtn) {
      this.muteBtn.setAttribute('aria-label', this.isMuted ? 'Unmute' : 'Mute');
      this.muteBtn.innerHTML = this.isMuted 
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg>`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audioElement.volume = this.volume;
    if (this.masterGain && this.audioCtx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.audioCtx.currentTime, 0.05);
    }
  }

  // Adjust volume dynamically to enhance scene emotional atmosphere
  setSceneMood(sceneNum) {
    if (this.isMuted) return;
    switch (sceneNum) {
      case 1: // Universe Creation
        this.setVolume(0.7);
        break;
      case 2: // Earth
        this.setVolume(0.75);
        break;
      case 3: // Letter: intimate, gentle
        this.setVolume(0.55);
        break;
      case 4: // Museum: elegant gallery atmosphere
        this.setVolume(0.7);
        break;
      case 5: // Spotlight: building anticipation
        this.setVolume(0.8);
        break;
      case 6: // Grand Reveal: full expressive warmth
        this.setVolume(0.9);
        break;
    }
  }

  updateUI(playing) {
    if (this.visualizerBars) {
      if (playing) {
        this.visualizerBars.classList.add('audio-playing');
      } else {
        this.visualizerBars.classList.remove('audio-playing');
      }
    }
    if (this.playPauseBtn) {
      this.playPauseBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      this.playPauseBtn.innerHTML = playing
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    }
  }

  updateProgressBar(cur, total) {
    if (this.progressBar && total > 0) {
      const pct = Math.min(100, (cur / total) * 100);
      this.progressBar.style.width = `${pct}%`;
    }
    if (this.timeDisplay && total > 0) {
      const formatTime = (t) => {
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
      };
      this.timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(total)}`;
    }
  }

  /* --------------------------------------------------------------------------
     Cinematic Sound Effects (Web Audio API)
     -------------------------------------------------------------------------- */
  playBigBangSound() {
    this.ensureContext();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 1.8);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 2.5);

      const bufferSize = this.audioCtx.sampleRate * 2.0;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.8);
      filter.frequency.exponentialRampToValueAtTime(100, now + 2.0);

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);
    } catch (e) {}
  }

  playWarpSound() {
    this.ensureContext();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 1.0);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch (e) {}
  }

  playSealBreakSound() {
    this.ensureContext();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const bufferSize = this.audioCtx.sampleRate * 0.18;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
      }
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(now);
    } catch (e) {}
  }

  playMuseumDoorSound() {
    this.ensureContext();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.linearRampToValueAtTime(50, now + 1.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 1.5);
    } catch (e) {}
  }

  playSpotlightSound() {
    this.ensureContext();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.75);
    } catch (e) {}
  }

  playCurtainSweepSound() {
    this.ensureContext();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const bufferSize = this.audioCtx.sampleRate * 1.6;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.linearRampToValueAtTime(900, now + 0.7);
      filter.frequency.linearRampToValueAtTime(180, now + 1.5);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(now);
    } catch (e) {}
  }
}

// Global instance
window.cinematicAudio = new CinematicAudioEngine();
