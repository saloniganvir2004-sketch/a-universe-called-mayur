/* ==========================================================================
   A UNIVERSE CALLED MAYUR — Cinematic Audio Engine
   Featured Melody: "O Mere Dil Ke Chain" (Kishore Kumar, 1972)
   Vintage Bollywood Instrumental Synthesizer + Local MP3 Support + SFX
   ========================================================================== */

class CinematicAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.volume = 0.7;
    this.localAudio = null;
    this.hasUserInteracted = false;
    this.isUsingSynthesizer = false;

    // Melody sequence state
    this.melodyInterval = null;
    this.bassInterval = null;
    this.padOscillators = [];
    this.currentNoteIndex = 0;
    this.trackDuration = 180; // Estimated 3 minutes loop
    this.currentTime = 0;
    this.progressTimer = null;

    // UI Elements
    this.playPauseBtn = document.getElementById('audio-play-pause-btn');
    this.muteBtn = document.getElementById('audio-mute-btn');
    this.volumeSlider = document.getElementById('audio-volume-slider');
    this.progressBar = document.getElementById('audio-progress-bar');
    this.timeDisplay = document.getElementById('audio-time-display');
    this.visualizerBars = document.getElementById('audio-visualizer-bars');
    this.songTitleEl = document.getElementById('audio-song-title');
    this.songArtistEl = document.getElementById('audio-song-artist');

    this.init();
  }

  init() {
    // Try loading local audio file (supports o-mere-dil-ke-chain.mp3 or background.mp3)
    this.localAudio = new Audio();
    this.localAudio.loop = true;
    
    // Check possible local files
    const possiblePaths = [
      'assets/audio/o-mere-dil-ke-chain.mp3',
      'assets/audio/background.mp3'
    ];

    let sourceIndex = 0;
    const tryNextSource = () => {
      if (sourceIndex < possiblePaths.length) {
        this.localAudio.src = possiblePaths[sourceIndex++];
        this.localAudio.load();
      } else {
        // Fall back completely to built-in vintage Bollywood melody synth
        this.isUsingSynthesizer = true;
        this.updateTrackInfo(true);
      }
    };

    this.localAudio.addEventListener('canplaythrough', () => {
      this.isUsingSynthesizer = false;
      this.updateTrackInfo(false);
    });

    this.localAudio.addEventListener('error', () => {
      tryNextSource();
    });

    tryNextSource();

    // Event listeners for UI controls
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => this.togglePlayback());
    }

    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => this.toggleMute());
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
    }

    // Progress updates for local audio
    this.localAudio.addEventListener('timeupdate', () => {
      if (!this.isUsingSynthesizer && this.localAudio.duration) {
        this.updateProgressBar(this.localAudio.currentTime, this.localAudio.duration);
      }
    });

    // Auto-unlock Web Audio on first user interaction
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

  updateTrackInfo(isAlternative) {
    if (this.songTitleEl) {
      this.songTitleEl.textContent = 'O MERE DIL KE CHAIN';
    }
    if (this.songArtistEl) {
      this.songArtistEl.textContent = isAlternative 
        ? 'Kishore Kumar (Instrumental Arrangement)' 
        : 'Kishore Kumar • Mere Jeevan Saathi (1972)';
    }
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      this.musicGain = this.audioCtx.createGain();
      this.musicGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.audioCtx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
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
    this.isPlaying = true;
    this.updateUI(true);

    if (!this.isUsingSynthesizer && this.localAudio && this.localAudio.src) {
      const playPromise = this.localAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.isUsingSynthesizer = true;
          this.updateTrackInfo(true);
          this.startVintageMelodySynth();
        });
      }
    } else {
      this.startVintageMelodySynth();
    }
  }

  pause() {
    this.isPlaying = false;
    this.updateUI(false);

    if (this.localAudio) {
      this.localAudio.pause();
    }
    this.stopVintageMelodySynth();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime, 0.05);
    }
    if (this.localAudio) {
      this.localAudio.muted = this.isMuted;
    }
    if (this.muteBtn) {
      this.muteBtn.setAttribute('aria-label', this.isMuted ? 'Unmute' : 'Mute');
      this.muteBtn.innerHTML = this.isMuted 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.localAudio) {
      this.localAudio.volume = this.volume;
    }
    if (this.masterGain && this.audioCtx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.audioCtx.currentTime, 0.05);
    }
  }

  // Adjust volume dynamically based on scene emotional intensity
  setSceneMood(sceneNum) {
    if (!this.musicGain || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    switch (sceneNum) {
      case 1: // Universe Creation
        this.musicGain.gain.setTargetAtTime(0.65, now, 1.5);
        break;
      case 2: // Earth
        this.musicGain.gain.setTargetAtTime(0.7, now, 1.5);
        break;
      case 3: // Letter: soft, intimate
        this.musicGain.gain.setTargetAtTime(0.45, now, 1.5);
        break;
      case 4: // Museum: elegant, contemplative
        this.musicGain.gain.setTargetAtTime(0.65, now, 1.5);
        break;
      case 5: // Spotlight: growing emotional intensity
        this.musicGain.gain.setTargetAtTime(0.8, now, 1.5);
        break;
      case 6: // Grand Reveal: climax, warm, expressive
        this.musicGain.gain.setTargetAtTime(0.9, now, 1.5);
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
    if (this.progressBar) {
      const pct = Math.min(100, (cur / total) * 100);
      this.progressBar.style.width = `${pct}%`;
    }
    if (this.timeDisplay) {
      const formatTime = (t) => {
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
      };
      this.timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(total)}`;
    }
  }

  /* --------------------------------------------------------------------------
     Authentic "O Mere Dil Ke Chain" Vintage Bollywood Synthesizer
     Recreating the iconic melody: O Mere Dil Ke Chain, Chain Aaye Mere Dil Ko...
     -------------------------------------------------------------------------- */
  startVintageMelodySynth() {
    this.stopVintageMelodySynth();

    // Warm vintage Rhodes / harmonium chords in D major
    // Dmaj7, Gmaj7, Em7, A7
    const chords = [
      [146.83, 185.00, 220.00, 277.18], // D, F#, A, C# (Dmaj7)
      [146.83, 185.00, 220.00, 293.66], // D, F#, A, D
      [196.00, 246.94, 293.66, 369.99], // G, B, D, F# (Gmaj7)
      [164.81, 196.00, 246.94, 293.66], // E, G, B, D (Em7)
      [220.00, 277.18, 329.63, 392.00]  // A, C#, E, G (A7)
    ];

    // Filter for warm 1970s analog vinyl / tape warmth
    const warmFilter = this.audioCtx.createBiquadFilter();
    warmFilter.type = 'lowpass';
    warmFilter.frequency.setValueAtTime(650, this.audioCtx.currentTime);
    warmFilter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);
    warmFilter.connect(this.musicGain);

    // Continuous warm ambient pad drone
    [73.42, 110.00, 146.83].forEach(freq => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(warmFilter);
      osc.start();
      this.padOscillators.push({ osc, gain });
    });

    /* Iconic "O Mere Dil Ke Chain" Lead Melody Notes (in D Major / B Minor)
       O (F#4) Me-re (A4, B4) Dil (A4) Ke (F#4) Chain (D4)...
       Chain (F#4) Aa-ye (G4, A4) Me-re (G4) Dil (F#4) Ko (E4)...
       Du-a (F#4, G4) Ki-ji-ye (A4, F#4, D4)... */
    const melody = [
      // Phrase 1: "O mere dil ke chain"
      { note: 369.99, dur: 0.7 }, // F#4 (O)
      { note: 440.00, dur: 0.35 },// A4  (me-)
      { note: 493.88, dur: 0.45 },// B4  (re)
      { note: 440.00, dur: 0.75 },// A4  (dil)
      { note: 369.99, dur: 0.4 }, // F#4 (ke)
      { note: 293.66, dur: 1.2 }, // D4  (chain)
      { note: 0,      dur: 0.5 }, // Rest

      // Phrase 2: "Chain aaye mere dil ko"
      { note: 369.99, dur: 0.6 }, // F#4 (chain)
      { note: 392.00, dur: 0.35 },// G4  (aa-)
      { note: 440.00, dur: 0.5 }, // A4  (ye)
      { note: 392.00, dur: 0.45 },// G4  (me-)
      { note: 369.99, dur: 0.4 }, // F#4 (re)
      { note: 329.63, dur: 1.1 }, // E4  (dil ko)
      { note: 0,      dur: 0.4 }, // Rest

      // Phrase 3: "Dua kijiye"
      { note: 369.99, dur: 0.45 },// F#4 (du-)
      { note: 392.00, dur: 0.45 },// G4  (a)
      { note: 440.00, dur: 0.5 }, // A4  (ki-)
      { note: 369.99, dur: 0.4 }, // F#4 (ji-)
      { note: 293.66, dur: 1.4 }, // D4  (ye...)
      { note: 0,      dur: 0.8 }, // Rest

      // Phrase 4: Instrumental flute fill
      { note: 587.33, dur: 0.3 }, // D5
      { note: 554.37, dur: 0.25 },// C#5
      { note: 587.33, dur: 0.3 }, // D5
      { note: 493.88, dur: 0.4 }, // B4
      { note: 440.00, dur: 0.45 },// A4
      { note: 369.99, dur: 0.6 }, // F#4
      { note: 293.66, dur: 1.2 }, // D4
      { note: 0,      dur: 1.0 }  // Rest
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (!this.isPlaying || !this.isUsingSynthesizer) return;
      const n = melody[noteIdx];
      noteIdx = (noteIdx + 1) % melody.length;

      if (n.note > 0) {
        this.playVintageInstrumentNote(n.note, n.dur);
      }

      this.melodyInterval = setTimeout(playNextNote, n.dur * 1000);
    };

    playNextNote();

    // Progress counter for UI
    this.currentTime = 0;
    this.progressTimer = setInterval(() => {
      if (!this.isPlaying) return;
      this.currentTime = (this.currentTime + 1) % this.trackDuration;
      this.updateProgressBar(this.currentTime, this.trackDuration);
    }, 1000);
  }

  playVintageInstrumentNote(freq, dur) {
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;
    try {
      const now = this.audioCtx.currentTime;
      
      // Dual oscillator for rich vintage analog flute/sax texture
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq, now);
      osc2.detune.setValueAtTime(4, now); // slight chorus

      // Subtle warm vibrato
      const vibrato = this.audioCtx.createOscillator();
      const vibratoGain = this.audioCtx.createGain();
      vibrato.frequency.setValueAtTime(5.2, now); // 5Hz vibrato
      vibratoGain.gain.setValueAtTime(3.5, now);
      vibrato.connect(osc1.frequency);
      vibrato.connect(osc2.frequency);
      vibrato.start(now);
      vibrato.stop(now + dur);

      // Envelope: smooth vintage attack and gentle release
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      noteGain.gain.setValueAtTime(0.11, now + dur * 0.7);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(this.musicGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + dur + 0.05);
      osc2.stop(now + dur + 0.05);
    } catch (e) {}
  }

  stopVintageMelodySynth() {
    if (this.melodyInterval) {
      clearTimeout(this.melodyInterval);
      this.melodyInterval = null;
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
    this.padOscillators.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    });
    this.padOscillators = [];
  }

  /* --------------------------------------------------------------------------
     Procedural Sound Effects
     -------------------------------------------------------------------------- */
  playBigBangSound() {
    this.ensureContext();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      // Sub-bass boom
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 1.8);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 2.6);

      // Cosmic noise whoosh
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
