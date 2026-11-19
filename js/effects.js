/* ==========================================================================
   A UNIVERSE CALLED MAYUR — Canvas & Visual Effects Engine
   True Universe Creation Sequence (Singularity -> Big Bang -> Stars -> Galaxy)
   Earth Orbital Simulation • Atmospheric Lighting • 60FPS Parallax Particles
   ========================================================================== */

class CosmicEffectsEngine {
  constructor() {
    this.activeScene = 1;
    this.animationFrames = {};

    // Canvases
    this.canvas01 = document.getElementById('canvas-scene-01');
    this.canvas02 = document.getElementById('canvas-scene-02');
    this.earthCanvas = document.getElementById('earth-canvas');
    this.canvas03 = document.getElementById('canvas-scene-03');
    this.canvas05 = document.getElementById('canvas-scene-05');
    this.canvas06 = document.getElementById('canvas-scene-06');

    // Contexts
    this.ctx01 = this.canvas01?.getContext('2d');
    this.ctx02 = this.canvas02?.getContext('2d');
    this.earthCtx = this.earthCanvas?.getContext('2d');
    this.ctx03 = this.canvas03?.getContext('2d');
    this.ctx05 = this.canvas05?.getContext('2d');
    this.ctx06 = this.canvas06?.getContext('2d');

    // Scene 01: Universe Creation State
    // 0: Initial Singularity (waiting for user click)
    // 1: Pulsing Singularity
    // 2: The Big Bang (explosive expansion)
    // 3: Star Formation
    // 4: Galaxy Formation (spiral arms spin)
    // 5: Complete Universe (typography revealed)
    this.creationStage = 0;
    this.bigBangParticles = [];
    this.bigBangShockwaves = [];
    this.stars = [];
    this.galaxyStars = [];
    this.nebulaBlobs = [];
    this.isWarping = false;
    this.singularityPulse = 0;

    // Earth state
    this.earthRotation = 0;

    // Candlelight & Particles
    this.candlePhase = 0;
    this.particles03 = [];
    this.spotlightMotes = [];
    this.particles06 = [];

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    this.initStars();
    this.initScene03Particles();
    this.initSpotlightMotes();
    this.initScene06Particles();

    // Start rendering Scene 01 loop
    this.startScene01Animation();
  }

  handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvases = [
      this.canvas01, this.canvas02, this.canvas03, 
      this.canvas05, this.canvas06
    ];

    canvases.forEach(canvas => {
      if (canvas) {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
      }
    });

    if (this.earthCanvas) {
      const rect = this.earthCanvas.getBoundingClientRect();
      const s = Math.max(rect.width || 420, 280);
      this.earthCanvas.width = s * dpr;
      this.earthCanvas.height = s * dpr;
      if (this.earthCtx) this.earthCtx.scale(dpr, dpr);
    }
  }

  /* ==========================================================================
     SCENE 01: THE CREATION OF THE UNIVERSE
     ========================================================================== */
  initStars() {
    this.stars = [];
    const count = 450;
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * w * 1.8,
        y: (Math.random() - 0.5) * h * 1.8,
        z: Math.random() * 1000 + 1,
        radius: Math.random() * 1.8 + 0.4,
        color: Math.random() > 0.4 ? '#FFFFFF' : (Math.random() > 0.5 ? '#DFB872' : '#A8C7FA'),
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        phase: Math.random() * Math.PI * 2,
        currentAlpha: 0
      });
    }

    // Spiral Galaxy Particles (Gold, Sapphire, Violet)
    this.galaxyStars = [];
    const galaxyArms = 4;
    const galaxyCount = 550;
    for (let i = 0; i < galaxyCount; i++) {
      const arm = i % galaxyArms;
      const angle = (arm * (2 * Math.PI / galaxyArms)) + (Math.random() * 0.7) + (i / galaxyCount) * 4.5;
      const dist = Math.pow(Math.random(), 1.5) * Math.min(w, h) * 0.45;
      let color = '#FFF2D6';
      if (dist > 60) {
        const rand = Math.random();
        if (rand < 0.45) color = '#DFB872'; // antique gold
        else if (rand < 0.8) color = '#5C8DF6'; // cosmic sapphire
        else color = '#B77CF5'; // cosmic violet
      }
      this.galaxyStars.push({
        angle,
        dist,
        speed: (0.0006 + (0.0004 * (1 - dist / (Math.min(w, h) * 0.45)))),
        size: Math.random() * 2.2 + 0.6,
        color,
        alpha: Math.random() * 0.7 + 0.3,
        currentAlpha: 0
      });
    }

    // Pre-calculate Nebula Blobs
    this.nebulaBlobs = [
      { x: -0.15, y: -0.1, r: 0.55, c1: 'rgba(26, 44, 92, 0.45)', c2: 'transparent' },
      { x: 0.1, y: 0.08, r: 0.48, c1: 'rgba(78, 32, 110, 0.35)', c2: 'transparent' },
      { x: 0.0, y: 0.0, r: 0.35, c1: 'rgba(223, 184, 114, 0.3)', c2: 'transparent' }
    ];
  }

  // Triggered when user clicks "CREATE OUR UNIVERSE"
  triggerUniverseCreation(onComplete) {
    const btnCreate = document.getElementById('btn-create-universe');
    if (btnCreate) {
      btnCreate.style.opacity = '0';
      btnCreate.style.pointerEvents = 'none';
      btnCreate.style.transform = 'translate(-50%, 20px)';
    }

    // Play Big Bang Audio
    if (window.cinematicAudio) {
      window.cinematicAudio.playBigBangSound();
      window.cinematicAudio.play(); // Start O Mere Dil Ke Chain melody on first interaction!
    }

    // Stage 1: Intensive Singularity Pulse
    this.creationStage = 1;

    // Stage 2: The Big Bang Explosion (after 600ms)
    setTimeout(() => {
      this.creationStage = 2;
      this.spawnBigBangParticles();
    }, 600);

    // Stage 3: Star Formation (after 1600ms)
    setTimeout(() => {
      this.creationStage = 3;
    }, 1600);

    // Stage 4: Galaxy Formation (after 2800ms)
    setTimeout(() => {
      this.creationStage = 4;
    }, 2800);

    // Stage 5: Personal Revelation & Title (after 4000ms)
    setTimeout(() => {
      this.creationStage = 5;
      this.revealPersonalNarrative(onComplete);
    }, 4000);
  }

  spawnBigBangParticles() {
    this.bigBangParticles = [];
    this.bigBangShockwaves = [
      { r: 0, maxR: Math.max(window.innerWidth, window.innerHeight) * 1.2, speed: 28, alpha: 1, color: '#FFF8E7' },
      { r: 0, maxR: Math.max(window.innerWidth, window.innerHeight) * 1.0, speed: 18, alpha: 0.8, color: '#DFB872' },
      { r: 0, maxR: Math.max(window.innerWidth, window.innerHeight) * 0.8, speed: 12, alpha: 0.6, color: '#6A9EFF' }
    ];

    const count = 350;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 22 + 4;
      this.bigBangParticles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1,
        color: Math.random() > 0.3 ? '#FFFDF5' : (Math.random() > 0.5 ? '#DFB872' : '#7BB0FF'),
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008
      });
    }
  }

  revealPersonalNarrative(onComplete) {
    const line1 = document.getElementById('narrative-line-1');
    const line2 = document.getElementById('narrative-line-2');
    const line3 = document.getElementById('narrative-line-3');
    const mainTitleBlock = document.getElementById('universe-title-block');
    const btnEnter = document.getElementById('btn-enter-universe');
    const scene01 = document.getElementById('scene-01');

    const revealAll = () => {
      if (line1) line1.classList.add('visible');
      if (line2) line2.classList.add('visible');
      if (line3) line3.classList.add('visible');
      if (mainTitleBlock) mainTitleBlock.classList.add('visible');
      if (btnEnter) {
        btnEnter.classList.add('visible');
        btnEnter.removeAttribute('disabled');
      }
      if (onComplete) onComplete();
    };

    // Staggered Narrative
    setTimeout(() => { if (line1) line1.classList.add('visible'); }, 300);
    setTimeout(() => { if (line2) line2.classList.add('visible'); }, 1200);
    setTimeout(() => { if (line3) line3.classList.add('visible'); }, 2100);
    setTimeout(() => { revealAll(); }, 3000);

    // Fast forward on click
    if (scene01) {
      scene01.addEventListener('click', revealAll, { once: true });
    }
  }

  startScene01Animation() {
    const loop = (timestamp) => {
      if (this.activeScene === 1) {
        this.renderScene01(timestamp);
      }
      this.animationFrames['scene01'] = requestAnimationFrame(loop);
    };
    this.animationFrames['scene01'] = requestAnimationFrame(loop);
  }

  renderScene01(timestamp) {
    if (!this.ctx01) return;
    const ctx = this.ctx01;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;

    if (this.isWarping) {
      ctx.fillStyle = 'rgba(9, 9, 9, 0.28)';
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.clearRect(0, 0, w, h);
    }

    // STAGE 0: Initial Singularity (Waiting for click)
    if (this.creationStage === 0) {
      this.singularityPulse += 0.04;
      const pulseSize = 3.5 + Math.sin(this.singularityPulse) * 1.5;
      const glowSize = 30 + Math.sin(this.singularityPulse) * 12;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.3, 'rgba(223, 184, 114, 0.6)');
      grad.addColorStop(0.7, 'rgba(196, 154, 84, 0.15)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, glowSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#DFB872';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
      return;
    }

    // STAGE 1: Concentrated Singularity Tremble
    if (this.creationStage === 1) {
      const shakeX = (Math.random() - 0.5) * 4;
      const shakeY = (Math.random() - 0.5) * 4;
      const flareSize = 50 + Math.random() * 30;

      const grad = ctx.createRadialGradient(cx + shakeX, cy + shakeY, 0, cx + shakeX, cy + shakeY, flareSize);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.4, 'rgba(255, 240, 200, 0.8)');
      grad.addColorStop(0.8, 'rgba(223, 184, 114, 0.4)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx + shakeX, cy + shakeY, flareSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // STAGE 2+: Big Bang Shockwaves & Explosive Particles
    if (this.creationStage >= 2 && this.bigBangShockwaves.length > 0) {
      this.bigBangShockwaves.forEach(sw => {
        sw.r += sw.speed;
        sw.alpha = Math.max(0, 1 - sw.r / sw.maxR);
        if (sw.alpha > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, sw.r, 0, Math.PI * 2);
          ctx.strokeStyle = sw.color;
          ctx.lineWidth = Math.max(1, 6 * (1 - sw.r / sw.maxR));
          ctx.globalAlpha = sw.alpha * 0.7;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      this.bigBangParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.beginPath();
          ctx.arc(cx + p.x, cy + p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });
    }

    // STAGE 3+: Nebula Clouds Blooming
    if (this.creationStage >= 3) {
      const maxNebulaAlpha = this.creationStage >= 4 ? 0.65 : 0.35;
      this.nebulaBlobs.forEach(blob => {
        const nx = cx + blob.x * w;
        const ny = cy + blob.y * h;
        const nr = blob.r * Math.min(w, h);

        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        g.addColorStop(0, blob.c1);
        g.addColorStop(1, blob.c2);

        ctx.fillStyle = g;
        ctx.globalAlpha = maxNebulaAlpha;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      });
    }

    // STAGE 4+: Galaxy Formation (Rotating Spiral Arms)
    if (this.creationStage >= 4) {
      this.galaxyStars.forEach(star => {
        star.angle += star.speed;
        star.currentAlpha = Math.min(star.alpha, star.currentAlpha + 0.015);

        const gx = cx + Math.cos(star.angle) * star.dist;
        const gy = cy + Math.sin(star.angle) * star.dist * 0.65; // 3D tilt

        ctx.beginPath();
        ctx.arc(gx, gy, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.currentAlpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // STAGE 3+: Stars in 3D Space (with parallax & twinkle, or warp speed)
    if (this.creationStage >= 3) {
      this.stars.forEach(star => {
        star.currentAlpha = Math.min(star.opacity, star.currentAlpha + 0.02);

        if (this.isWarping) {
          // Warp Speed Streaks
          star.z -= 38;
          if (star.z <= 0) star.z = 1000;

          const k = 420 / star.z;
          const px = star.x * k + cx;
          const py = star.y * k + cy;

          const prevK = 420 / (star.z + 55);
          const prevPx = star.x * prevK + cx;
          const prevPy = star.y * prevK + cy;

          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = star.color;
          ctx.lineWidth = Math.min(star.radius * 2.4, 4.5);
          ctx.globalAlpha = Math.min(1, (1000 - star.z) / 380);
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          // Gentle ambient twinkle with depth
          star.phase += star.twinkleSpeed;
          const k = 420 / star.z;
          const px = star.x * k + cx;
          const py = star.y * k + cy;

          if (px > 0 && px < w && py > 0 && py < h) {
            const alpha = star.currentAlpha * (0.6 + 0.4 * Math.sin(star.phase));
            ctx.beginPath();
            ctx.arc(px, py, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      });
    }

    // Central Core Glow for Galaxy
    if (this.creationStage >= 4 && !this.isWarping) {
      const corePulse = 1 + 0.1 * Math.sin(timestamp * 0.002);
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70 * corePulse);
      coreGrad.addColorStop(0, 'rgba(255, 248, 220, 0.9)');
      coreGrad.addColorStop(0.3, 'rgba(223, 184, 114, 0.5)');
      coreGrad.addColorStop(0.7, 'rgba(16, 27, 53, 0.2)');
      coreGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 70 * corePulse, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  triggerWarpTransition(onComplete) {
    this.isWarping = true;
    if (window.cinematicAudio) {
      window.cinematicAudio.playWarpSound();
    }

    setTimeout(() => {
      this.isWarping = false;
      if (onComplete) onComplete();
    }, 1500);
  }

  /* ==========================================================================
     SCENE 02: THE WORLD (EARTH APPROACH)
     ========================================================================== */
  startScene02Animation() {
    const loop = () => {
      if (this.activeScene === 2) {
        this.renderScene02();
        this.renderEarth();
      }
      this.animationFrames['scene02'] = requestAnimationFrame(loop);
    };
    this.animationFrames['scene02'] = requestAnimationFrame(loop);
  }

  renderScene02() {
    if (!this.ctx02) return;
    const ctx = this.ctx02;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    // Distant background stars
    this.stars.slice(0, 160).forEach(star => {
      star.phase += 0.02;
      const k = 420 / star.z;
      const px = star.x * k + w / 2;
      const py = star.y * k + h / 2;

      ctx.beginPath();
      ctx.arc(px, py, star.radius * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.opacity * 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  renderEarth() {
    if (!this.earthCtx || !this.earthCanvas) return;
    const ctx = this.earthCtx;
    const size = this.earthCanvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const radius = size * 0.46;
    const cx = size / 2;
    const cy = size / 2;

    ctx.clearRect(0, 0, size, size);
    this.earthRotation += 0.003;

    // Clip to spherical circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Ocean deep gradient
    const oceanGrad = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, 10, cx, cy, radius);
    oceanGrad.addColorStop(0, '#1E488F');
    oceanGrad.addColorStop(0.55, '#0B224E');
    oceanGrad.addColorStop(1, '#050D21');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, size, size);

    // Procedural Continents
    ctx.fillStyle = 'rgba(76, 118, 80, 0.78)';
    for (let i = -2; i <= 3; i++) {
      const offsetX = ((this.earthRotation * 125 + i * radius * 0.92) % (radius * 2.8)) - radius * 1.4;
      ctx.beginPath();
      ctx.ellipse(cx + offsetX, cy - radius * 0.18, radius * 0.36, radius * 0.22, 0.2, 0, Math.PI * 2);
      ctx.ellipse(cx + offsetX + 25, cy + radius * 0.18, radius * 0.3, radius * 0.38, -0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Swirling Clouds layer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
    for (let c = -2; c <= 3; c++) {
      const cloudX = ((this.earthRotation * 165 + c * radius * 1.1) % (radius * 3.1)) - radius * 1.55;
      ctx.beginPath();
      ctx.ellipse(cx + cloudX, cy - radius * 0.28, radius * 0.44, radius * 0.11, 0.1, 0, Math.PI * 2);
      ctx.ellipse(cx + cloudX + 38, cy + radius * 0.06, radius * 0.52, radius * 0.15, -0.08, 0, Math.PI * 2);
      ctx.ellipse(cx + cloudX - 25, cy + radius * 0.36, radius * 0.36, radius * 0.09, 0.05, 0, Math.PI * 2);
      ctx.fill();
    }

    // Night Terminus (Atmospheric Shadow)
    const shadowGrad = ctx.createRadialGradient(cx - radius * 0.4, cy - radius * 0.4, radius * 0.2, cx + radius * 0.3, cy + radius * 0.3, radius * 1.1);
    shadowGrad.addColorStop(0, 'transparent');
    shadowGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.4)');
    shadowGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.85)');
    shadowGrad.addColorStop(1, 'rgba(4, 7, 14, 0.98)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(0, 0, size, size);

    ctx.restore();

    // Rayleigh scattering blue atmosphere
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(96, 172, 255, 0.45)';
    ctx.lineWidth = 4.5;
    ctx.stroke();

    // Golden sunrise rim on limb
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 1, Math.PI * 0.85, Math.PI * 1.45);
    ctx.strokeStyle = 'rgba(255, 235, 180, 0.95)';
    ctx.lineWidth = 5.5;
    ctx.shadowColor = '#DFB872';
    ctx.shadowBlur = 22;
    ctx.stroke();
    ctx.restore();
  }

  /* ==========================================================================
     SCENE 03: ANTIQUE LETTER (Candlelight Ambient Glow & Dust)
     ========================================================================== */
  initScene03Particles() {
    this.particles03 = [];
    const count = 50;
    for (let i = 0; i < count; i++) {
      this.particles03.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.6 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  startScene03Animation() {
    const loop = () => {
      if (this.activeScene === 3) {
        this.renderScene03();
      }
      this.animationFrames['scene03'] = requestAnimationFrame(loop);
    };
    this.animationFrames['scene03'] = requestAnimationFrame(loop);
  }

  renderScene03() {
    if (!this.ctx03) return;
    const ctx = this.ctx03;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    // Warm flickering candlelight ambiance from bottom corners
    this.candlePhase += 0.06;
    const candleFlicker = 1 + 0.08 * (Math.sin(this.candlePhase) + Math.cos(this.candlePhase * 1.7) * 0.5);

    const candleGrad = ctx.createRadialGradient(w * 0.2, h * 0.85, 20, w * 0.2, h * 0.85, 320 * candleFlicker);
    candleGrad.addColorStop(0, 'rgba(223, 160, 60, 0.12)');
    candleGrad.addColorStop(0.5, 'rgba(180, 110, 40, 0.05)');
    candleGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = candleGrad;
    ctx.fillRect(0, 0, w, h);

    this.particles03.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < 0) p.y = h;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#DFB872';
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = '#C49A54';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });
  }

  /* ==========================================================================
     SCENE 05: THE SPOTLIGHT (Stage Dust Motes)
     ========================================================================== */
  initSpotlightMotes() {
    this.spotlightMotes = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      this.spotlightMotes.push({
        x: (Math.random() - 0.5) * 380 + window.innerWidth / 2,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.1,
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }

  startScene05Animation() {
    const loop = () => {
      if (this.activeScene === 5) {
        this.renderScene05();
      }
      this.animationFrames['scene05'] = requestAnimationFrame(loop);
    };
    this.animationFrames['scene05'] = requestAnimationFrame(loop);
  }

  renderScene05() {
    if (!this.ctx05) return;
    const ctx = this.ctx05;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w / 2;

    ctx.clearRect(0, 0, w, h);

    this.spotlightMotes.forEach(m => {
      m.x += m.vx;
      m.y += m.vy;

      if (m.y < 0) m.y = h;
      const coneWidthAtY = Math.max(120, (m.y / h) * 480);
      if (Math.abs(m.x - cx) > coneWidthAtY) {
        m.x = cx + (Math.random() - 0.5) * coneWidthAtY * 0.85;
      }

      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF4DC';
      ctx.globalAlpha = m.alpha;
      ctx.shadowColor = '#DFB872';
      ctx.shadowBlur = 7;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });
  }

  /* ==========================================================================
     SCENE 06: THE FINAL REVEAL (Golden Shimmer)
     ========================================================================== */
  initScene06Particles() {
    this.particles06 = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      this.particles06.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.5 - 0.15,
        phase: Math.random() * Math.PI * 2,
        twinkle: Math.random() * 0.05 + 0.02
      });
    }
  }

  startScene06Animation() {
    const loop = () => {
      if (this.activeScene === 6) {
        this.renderScene06();
      }
      this.animationFrames['scene06'] = requestAnimationFrame(loop);
    };
    this.animationFrames['scene06'] = requestAnimationFrame(loop);
  }

  renderScene06() {
    if (!this.ctx06) return;
    const ctx = this.ctx06;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    this.particles06.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.phase += p.twinkle;

      if (p.y < 0) p.y = h;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      const alpha = 0.3 + 0.5 * Math.sin(p.phase);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#DFB872';
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.shadowColor = '#C49A54';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });
  }

  setActiveScene(sceneNum) {
    this.activeScene = sceneNum;
    if (sceneNum === 2) this.startScene02Animation();
    if (sceneNum === 3) this.startScene03Animation();
    if (sceneNum === 5) this.startScene05Animation();
    if (sceneNum === 6) this.startScene06Animation();
  }
}

// Global instance
window.cosmicEffects = new CosmicEffectsEngine();
