/* ==========================================================================
   A UNIVERSE CALLED MAYUR — Scene Animations & Architectural Museum
   Antique Letter Unfolding • Grand Museum Promenade • Curtains & Reveals
   ========================================================================== */

class SceneAnimationController {
  constructor() {
    this.exploredExhibits = new Set();
    this.currentWingIndex = 0; // 0 to 4 (Wings 1-4 + Wing 5 Masterpiece)
    this.isLetterOpened = false;
    this.isMuseumDoorsOpened = false;
    this.isPromenadeTransitioning = false;
    this.isFinalGalleryOpen = false;
    this.isCuratorModalOpen = false;

    // Museum Wing Exhibition Data (All 5 wings defined)
    this.wingsData = [
      {
        id: 'strength',
        num: 'EXHIBITION 01',
        title: 'THE STRENGTH',
        quote: 'For the strength you carry, the challenges you face, and the determination with which you keep moving forward.',
        curatorNote: 'Strength in a man is often measured by what he bears in silence. Your quiet fortitude, calm resilience during trials, and steadfast courage make you a pillar of inspiration. You hold yourself with a dignity that speaks louder than words.',
        renderArt: (canvas) => this.renderStrengthArtwork(canvas)
      },
      {
        id: 'kindness',
        num: 'EXHIBITION 02',
        title: 'THE KINDNESS',
        quote: 'For the goodness in your actions, the warmth in your nature, and the little things that make you special.',
        curatorNote: 'True kindness is gentle power. The considerate gestures, the heartfelt concern, the natural warmth with which you treat people—these are the subtle masterstrokes that make your character irreplaceable.',
        renderArt: (canvas) => this.renderKindnessArtwork(canvas)
      },
      {
        id: 'ambition',
        num: 'EXHIBITION 03',
        title: 'THE AMBITION',
        quote: 'For your dreams, your efforts, your determination, and everything you are working towards.',
        curatorNote: 'Ambition without ego is rare, and you embody it. The dedication you pour into your aspirations, your relentless work ethic, and your gaze fixed firmly on the horizon prove that you are destined for greatness.',
        renderArt: (canvas) => this.renderAmbitionArtwork(canvas)
      },
      {
        id: 'individuality',
        num: 'EXHIBITION 04',
        title: 'THE INDIVIDUALITY',
        quote: 'For everything that makes you who you are. The qualities, personality and individuality that nobody else can replace.',
        curatorNote: 'Out of billions of lives, there is only one Mayur. Your smile, your unique perspective, your distinct presence, and the way you bring light into any space. Nobody else could ever fill the space you occupy.',
        renderArt: (canvas) => this.renderIndividualityArtwork(canvas)
      },
      {
        id: 'masterpiece',
        num: 'EXHIBITION 05',
        title: 'THE MASTERPIECE',
        quote: 'Every gallery has its most precious exhibit. And this one has been waiting for you.',
        curatorNote: 'Some masterpieces cannot be contained on ordinary walls. The final gallery is prepared for the main character.',
        renderArt: () => {}
      }
    ];

    this.init();
  }

  init() {
    this.setupLetterInteractions();
    this.setupMuseumArchitecture();
    this.setupFinalPortraitGallery();
    this.setupSpotlightInteractions();
    this.setupArchiveToggle();
    this.setupGlobalShortcuts();
  }

  /* --------------------------------------------------------------------------
     SCENE 03 — Antique Handwritten Letter Interactions
     -------------------------------------------------------------------------- */
  setupLetterInteractions() {
    const envelope = document.getElementById('letter-envelope');
    const openBtn = document.getElementById('btn-open-letter');
    const letterPaper = document.getElementById('letter-paper');
    const visitGalleryBtn = document.getElementById('btn-visit-gallery');

    const triggerOpen = () => {
      if (this.isLetterOpened) return;
      this.isLetterOpened = true;

      // Play authentic seal-breaking audio
      if (window.cinematicAudio) {
        window.cinematicAudio.playSealBreakSound();
      }

      // Crack wax seal
      const seal = document.getElementById('envelope-seal');
      if (seal) {
        seal.classList.add('seal-breaking');
      }

      // 3D Flip open envelope flap
      const flap = document.getElementById('envelope-flap');
      if (flap) {
        flap.classList.add('flap-opening');
      }

      // Hide open trigger button
      if (openBtn) {
        openBtn.style.opacity = '0';
        openBtn.style.pointerEvents = 'none';
      }

      // Slide parchment out and unfold in 3D perspective
      setTimeout(() => {
        if (letterPaper) {
          letterPaper.classList.add('open');
          this.revealLetterParagraphs();
        }
      }, 750);
    };

    if (envelope) envelope.addEventListener('click', triggerOpen);
    if (openBtn) openBtn.addEventListener('click', triggerOpen);

    // "VISIT YOUR PRIVATE GALLERY →"
    if (visitGalleryBtn) {
      visitGalleryBtn.addEventListener('click', () => {
        if (window.sceneNav) {
          window.sceneNav.goToScene(4);
        }
      });
    }
  }

  revealLetterParagraphs() {
    const paragraphs = document.querySelectorAll('.letter-paragraph');
    paragraphs.forEach((p, idx) => {
      setTimeout(() => {
        p.classList.add('visible');
      }, (idx + 1) * 600);
    });
  }

  /* --------------------------------------------------------------------------
     SCENE 04 — The Architectural Museum of Mayur
     Grand Double Doors • Vaulted Hallway Promenade • Interactive Wing Exhibits
     -------------------------------------------------------------------------- */
  setupMuseumArchitecture() {
    const entranceDoors = document.getElementById('museum-entrance-doors');
    const enterDoorsBtn = document.getElementById('btn-enter-museum-doors');
    const foyerView = document.getElementById('museum-foyer-view');
    const hallwayView = document.getElementById('museum-hallway-view');

    // Double Doors Entrance Opening
    const openMuseumDoors = () => {
      if (this.isMuseumDoorsOpened) return;
      this.isMuseumDoorsOpened = true;

      if (window.cinematicAudio) {
        window.cinematicAudio.playMuseumDoorSound();
      }

      if (entranceDoors) {
        entranceDoors.classList.add('doors-open');
      }

      setTimeout(() => {
        if (foyerView) foyerView.classList.add('foyer-passed');
        if (hallwayView) hallwayView.classList.add('hallway-entered');
        this.renderAllWingArtwork();
        this.goToWing(0); // Initialize at Wing 1
      }, 1200);
    };

    if (entranceDoors) entranceDoors.addEventListener('click', openMuseumDoors);
    if (enterDoorsBtn) enterDoorsBtn.addEventListener('click', openMuseumDoors);

    // Hallway Navigation Controls (Previous & Next Wing)
    const prevBtn = document.getElementById('btn-museum-prev-wing');
    const nextBtn = document.getElementById('btn-museum-next-wing');
    const wingTabs = document.querySelectorAll('.museum-wing-tab');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isPromenadeTransitioning) return;
        if (this.currentWingIndex > 0) {
          this.goToWing(this.currentWingIndex - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isPromenadeTransitioning) return;
        if (this.currentWingIndex < 4) {
          if (this.currentWingIndex === 3 && this.exploredExhibits.size < 4) {
            this.showCuratorHint(`Please explore all 4 appreciation exhibits to unlock the final masterpiece (${this.exploredExhibits.size} of 4 explored).`);
            return;
          }
          this.goToWing(this.currentWingIndex + 1);
        }
      });
    }

    wingTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetIdx = parseInt(tab.getAttribute('data-wing'), 10);
        if (!isNaN(targetIdx)) {
          if (targetIdx === 4 && this.exploredExhibits.size < 4) {
            this.showCuratorHint(`Please explore all 4 appreciation exhibits to unlock the final masterpiece (${this.exploredExhibits.size} of 4 explored).`);
            return;
          }
          this.goToWing(targetIdx);
        }
      });
    });

    // Inspect Artwork / Plaque Modal Listeners for Chambers 0-3
    const inspectButtons = document.querySelectorAll('.btn-inspect-plaque');
    inspectButtons.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openCuratorModal(idx);
      });
    });

    // Also make artwork frames in chambers 0 to 3 directly clickable to approach
    for (let i = 0; i < 4; i++) {
      const wingId = this.wingsData[i].id;
      const chamberEl = document.getElementById(`wing-chamber-${wingId}`);
      if (chamberEl) {
        const frame = chamberEl.querySelector('.wing-artwork-frame');
        if (frame) {
          frame.style.cursor = 'pointer';
          frame.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openCuratorModal(i);
          });
        }
      }
    }

    // Modal Close Listeners
    const modalBackdrop = document.getElementById('museum-modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeCuratorModal();
      });
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          this.closeCuratorModal();
        }
      });
    }

    // Chamber 05 (The Masterpiece) Unlock Actions
    const enterFinalGalleryBtn = document.getElementById('btn-enter-final-gallery');
    const chamber05Frame = document.getElementById('frame-chamber-masterpiece');

    const handleMasterpieceClick = (e) => {
      if (e) e.stopPropagation();
      if (this.exploredExhibits.size >= 4) {
        this.openFinalGallery();
      } else {
        this.showCuratorHint(`Please explore all 4 appreciation exhibits to unlock the final masterpiece (${this.exploredExhibits.size} of 4 explored).`);
      }
    };

    if (enterFinalGalleryBtn) {
      enterFinalGalleryBtn.addEventListener('click', handleMasterpieceClick);
    }
    if (chamber05Frame) {
      chamber05Frame.addEventListener('click', handleMasterpieceClick);
    }
  }

  /* --------------------------------------------------------------------------
     THE FINAL MASTERPIECE GALLERY ROOM (EXHIBITION 05 ROTUNDA)
     Open, Close, Reopen, and Gateway to Theatre
     -------------------------------------------------------------------------- */
  setupFinalPortraitGallery() {
    const galleryRoom = document.getElementById('final-portrait-gallery-room');
    const closeBtn = document.getElementById('btn-close-final-gallery');
    const closeBtnX = document.getElementById('btn-close-final-gallery-x');
    const advanceBtn = document.getElementById('btn-advance-to-theatre');

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeFinalGallery();
      });
    }

    if (closeBtnX) {
      closeBtnX.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeFinalGallery();
      });
    }

    if (advanceBtn) {
      advanceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.transitionToSpotlightScene();
      });
    }

    if (galleryRoom) {
      galleryRoom.addEventListener('click', (e) => {
        if (e.target === galleryRoom) {
          this.closeFinalGallery();
        }
      });
    }
  }

  setupGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isFinalGalleryOpen) {
          this.closeFinalGallery();
        } else if (this.isCuratorModalOpen) {
          this.closeCuratorModal();
        }
      }
    });
  }

  // Smoothly glide promenade to specific wing index (0 to 4)
  goToWing(targetIdx) {
    if (targetIdx < 0 || targetIdx > 4) return;

    if (targetIdx === 4 && this.exploredExhibits.size < 4) {
      this.showCuratorHint(`Please explore all 4 appreciation exhibits to unlock the final masterpiece (${this.exploredExhibits.size} of 4 explored).`);
      return;
    }

    this.currentWingIndex = targetIdx;
    this.isPromenadeTransitioning = true;

    const hallwayTrack = document.getElementById('museum-wings-track');
    const prevBtn = document.getElementById('btn-museum-prev-wing');
    const nextBtn = document.getElementById('btn-museum-next-wing');
    const wingTabs = document.querySelectorAll('.museum-wing-tab');

    // 5 chambers in 500% flex container = 20% each
    const shiftPercent = this.currentWingIndex * 20;
    if (hallwayTrack) {
      hallwayTrack.style.transform = `translateX(-${shiftPercent}%)`;
    }

    // Update Previous / Next Buttons
    if (prevBtn) {
      prevBtn.disabled = (this.currentWingIndex === 0);
    }

    if (nextBtn) {
      if (this.currentWingIndex === 4) {
        nextBtn.disabled = true;
      } else if (this.currentWingIndex === 3 && this.exploredExhibits.size < 4) {
        nextBtn.classList.add('locked-btn');
        nextBtn.disabled = false;
      } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('locked-btn');
      }
    }

    // Update Top Navigation Tabs
    wingTabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === this.currentWingIndex);
    });

    // Mark current wing as visited & explored if it's wings 0-3
    if (this.currentWingIndex < 4) {
      const wing = this.wingsData[this.currentWingIndex];
      if (wing) {
        this.markExhibitExplored(wing.id);
      }
    }

    // Release transition lock quickly so clicks are never sluggish
    setTimeout(() => {
      this.isPromenadeTransitioning = false;
    }, 320);
  }

  markExhibitExplored(wingId) {
    this.exploredExhibits.add(wingId);

    const chamberCard = document.getElementById(`wing-chamber-${wingId}`);
    if (chamberCard) {
      chamberCard.classList.add('visited', 'explored');
    }

    this.updateProgressUI();

    if (this.exploredExhibits.size >= 4) {
      this.unlockWing05();
    }
  }

  updateProgressUI() {
    const progressPill = document.getElementById('museum-progress-pill');
    if (progressPill) {
      const count = this.exploredExhibits.size;
      if (count >= 4) {
        progressPill.textContent = 'All 4 exhibits explored • Masterpiece Unlocked ✨';
        progressPill.classList.add('all-unlocked');
      } else {
        progressPill.textContent = `${count} of 4 exhibits explored`;
        progressPill.classList.remove('all-unlocked');
      }
    }
  }

  openCuratorModal(wingIdx) {
    if (wingIdx < 0 || wingIdx >= 4) return;
    const wing = this.wingsData[wingIdx];
    if (!wing) return;

    this.markExhibitExplored(wing.id);

    const modalBackdrop = document.getElementById('museum-modal-backdrop');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalCanvas = document.getElementById('modal-visual-canvas');
    const modalMessage = document.getElementById('modal-message');
    const modalCurator = document.getElementById('modal-deep-thought');

    if (modalTag) modalTag.textContent = wing.num;
    if (modalTitle) modalTitle.textContent = wing.title;
    if (modalMessage) modalMessage.textContent = `“${wing.quote}”`;
    if (modalCurator) modalCurator.textContent = wing.curatorNote;

    if (modalCanvas && typeof wing.renderArt === 'function') {
      wing.renderArt(modalCanvas);
    }

    if (modalBackdrop) {
      modalBackdrop.classList.add('open');
      this.isCuratorModalOpen = true;
    }
  }

  closeCuratorModal() {
    const modalBackdrop = document.getElementById('museum-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
    }
    this.isCuratorModalOpen = false;
  }

  openFinalGallery() {
    if (this.exploredExhibits.size < 4) {
      this.showCuratorHint(`Please explore all 4 appreciation exhibits first (${this.exploredExhibits.size} of 4 explored).`);
      return;
    }

    const galleryRoom = document.getElementById('final-portrait-gallery-room');
    if (galleryRoom) {
      if (window.cinematicAudio) {
        window.cinematicAudio.playCurtainSweepSound();
      }
      galleryRoom.classList.add('open');
      this.isFinalGalleryOpen = true;
    }
  }

  closeFinalGallery() {
    const galleryRoom = document.getElementById('final-portrait-gallery-room');
    if (galleryRoom) {
      galleryRoom.classList.remove('open');
    }
    this.isFinalGalleryOpen = false;
  }

  showCuratorHint(msg) {
    const hint = document.getElementById('museum-curator-hint');
    if (hint) {
      hint.textContent = msg;
      hint.classList.add('show');
      setTimeout(() => hint.classList.remove('show'), 3500);
    }
  }

  unlockWing05() {
    const chamber05 = document.getElementById('wing-chamber-masterpiece');
    const btnEnterFinal = document.getElementById('btn-enter-final-gallery');
    const curtainLeft = document.getElementById('curtain-left');
    const curtainRight = document.getElementById('curtain-right');
    const wingDot5 = document.querySelector('.museum-wing-tab[data-wing="4"]');
    const nextBtn = document.getElementById('btn-museum-next-wing');

    if (chamber05) chamber05.classList.add('unlocked');
    if (wingDot5) {
      wingDot5.classList.remove('tab-locked');
      wingDot5.innerHTML = '05. Masterpiece ✨';
      wingDot5.removeAttribute('disabled');
    }

    if (btnEnterFinal) {
      btnEnterFinal.removeAttribute('disabled');
      btnEnterFinal.classList.remove('disabled');
      btnEnterFinal.innerHTML = 'ENTER THE MASTERPIECE GALLERY <span class="btn-arrow">✨</span>';
    }

    if (this.currentWingIndex === 3 && nextBtn) {
      nextBtn.classList.remove('locked-btn');
      nextBtn.disabled = false;
    }

    // Part curtains in chamber preview
    if (curtainLeft && curtainRight) {
      curtainLeft.style.transform = 'translateX(-35%)';
      curtainRight.style.transform = 'translateX(35%)';
    }

    this.updateProgressUI();
  }

  transitionToSpotlightScene() {
    this.closeFinalGallery();
    const hallway = document.getElementById('museum-hallway-view');
    if (hallway) {
      hallway.style.filter = 'brightness(0.08)';
      hallway.style.transition = 'filter 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    setTimeout(() => {
      if (window.sceneNav) {
        window.sceneNav.goToScene(5);
      }
      if (hallway) {
        hallway.style.filter = '';
      }
    }, 1200);
  }

  /* --------------------------------------------------------------------------
     Art Exhibition Canvas Renderers
     -------------------------------------------------------------------------- */
  renderAllWingArtwork() {
    this.wingsData.forEach(wing => {
      const canvas = document.getElementById(`canvas-wing-${wing.id}`);
      if (canvas && typeof wing.renderArt === 'function') {
        wing.renderArt(canvas);
      }
    });
  }

  renderStrengthArtwork(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 500;
    const h = canvas.height = 360;

    // Dark majestic alpine mountain range in golden starlight
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0C0A09');
    bgGrad.addColorStop(0.55, '#1C1917');
    bgGrad.addColorStop(1, '#292524');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Glowing Golden Full Moon
    ctx.beginPath();
    ctx.arc(360, 85, 38, 0, Math.PI * 2);
    ctx.fillStyle = '#F4E2BB';
    ctx.shadowColor = '#DFB872';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Distant dark jagged ridges
    ctx.fillStyle = '#171412';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(100, 150);
    ctx.lineTo(220, 230);
    ctx.lineTo(380, 110);
    ctx.lineTo(500, 220);
    ctx.lineTo(500, h);
    ctx.closePath();
    ctx.fill();

    // Foreground mountain peaks with golden leaf highlights
    const mountainGrad = ctx.createLinearGradient(0, 160, 0, h);
    mountainGrad.addColorStop(0, '#2E2419');
    mountainGrad.addColorStop(1, '#0F0D0B');
    ctx.fillStyle = mountainGrad;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(160, 120);
    ctx.lineTo(290, 240);
    ctx.lineTo(420, 150);
    ctx.lineTo(500, 230);
    ctx.lineTo(500, h);
    ctx.closePath();
    ctx.fill();

    // Gold leaf ridges
    ctx.strokeStyle = '#DFB872';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(160, 120);
    ctx.lineTo(130, h);
    ctx.moveTo(160, 120);
    ctx.lineTo(220, 220);
    ctx.moveTo(420, 150);
    ctx.lineTo(390, h);
    ctx.stroke();
  }

  renderKindnessArtwork(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 500;
    const h = canvas.height = 360;

    // Radiant dawn sunlight pouring through golden mist
    const bgGrad = ctx.createRadialGradient(250, 180, 15, 250, 180, 280);
    bgGrad.addColorStop(0, '#FFF7E6');
    bgGrad.addColorStop(0.2, '#E8C57A');
    bgGrad.addColorStop(0.55, '#8C561B');
    bgGrad.addColorStop(1, '#1A0E04');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Warm Sunbeams
    ctx.save();
    ctx.translate(250, 180);
    for (let i = 0; i < 18; i++) {
      ctx.rotate((Math.PI * 2) / 18);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(40, 260);
      ctx.lineTo(-40, 260);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 245, 220, 0.14)';
      ctx.fill();
    }
    ctx.restore();

    // Floating golden bokeh circles
    for (let b = 0; b < 30; b++) {
      const bx = (Math.sin(b * 3.5) * 0.5 + 0.5) * w;
      const by = (Math.cos(b * 5.2) * 0.5 + 0.5) * h;
      const br = (b % 5 + 1) * 3.5;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 235, 180, 0.38)';
      ctx.fill();
    }
  }

  renderAmbitionArtwork(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 500;
    const h = canvas.height = 360;

    // Dramatic road into the golden sunrise horizon
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 200);
    skyGrad.addColorStop(0, '#0B111E');
    skyGrad.addColorStop(0.6, '#28242E');
    skyGrad.addColorStop(1, '#A07034');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, 200);

    // Ground plane
    ctx.fillStyle = '#141210';
    ctx.fillRect(0, 200, w, 160);

    // Sunrise Horizon Corona
    ctx.beginPath();
    ctx.arc(250, 200, 85, Math.PI, 0);
    ctx.fillStyle = '#F4E2BB';
    ctx.shadowColor = '#DFB872';
    ctx.shadowBlur = 35;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Perspective highway stretching into infinite sunrise
    ctx.fillStyle = '#22201D';
    ctx.beginPath();
    ctx.moveTo(246, 200);
    ctx.lineTo(254, 200);
    ctx.lineTo(380, h);
    ctx.lineTo(120, h);
    ctx.closePath();
    ctx.fill();

    // Gilded center stripe
    ctx.strokeStyle = '#DFB872';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(250, 200);
    ctx.lineTo(250, h);
    ctx.stroke();
  }

  renderIndividualityArtwork(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 500;
    const h = canvas.height = 360;

    // Deep sapphire, indigo & cosmic gold constellation
    const cosmicGrad = ctx.createRadialGradient(250, 180, 20, 250, 180, 260);
    cosmicGrad.addColorStop(0, '#1E2D5A');
    cosmicGrad.addColorStop(0.65, '#0B1021');
    cosmicGrad.addColorStop(1, '#05070D');
    ctx.fillStyle = cosmicGrad;
    ctx.fillRect(0, 0, w, h);

    // Custom celestial constellation
    const points = [
      { x: 150, y: 90 },
      { x: 250, y: 70 },
      { x: 340, y: 130 },
      { x: 290, y: 220 },
      { x: 250, y: 290 },
      { x: 160, y: 230 },
      { x: 250, y: 170 }
    ];

    ctx.strokeStyle = 'rgba(223, 184, 114, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.stroke();

    // Cross connecting lines
    ctx.beginPath();
    ctx.moveTo(points[1].x, points[1].y);
    ctx.lineTo(points[6].x, points[6].y);
    ctx.moveTo(points[3].x, points[3].y);
    ctx.lineTo(points[5].x, points[5].y);
    ctx.stroke();

    // Glowing stars on vertices
    points.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#DFB872';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  /* --------------------------------------------------------------------------
     SCENE 05 — The Spotlight Premiere
     -------------------------------------------------------------------------- */
  setupSpotlightInteractions() {
    const mainCharacterBtn = document.getElementById('btn-reveal-main-character');
    if (mainCharacterBtn) {
      mainCharacterBtn.addEventListener('click', () => {
        this.triggerGrandCurtainOpening();
      });
    }
  }

  triggerSpotlightSceneStart() {
    const scene05 = document.getElementById('scene-05');
    if (window.cinematicAudio) {
      window.cinematicAudio.playSpotlightSound();
      window.cinematicAudio.setSceneMood(5);
    }

    setTimeout(() => {
      if (scene05) scene05.classList.add('spotlight-active');
      this.revealSpotlightLines();
    }, 400);
  }

  revealSpotlightLines() {
    const l1 = document.getElementById('theatre-line-1');
    const l2 = document.getElementById('theatre-line-2');
    const l3 = document.getElementById('theatre-line-3');
    const l4 = document.getElementById('theatre-line-4');
    const btn = document.getElementById('btn-reveal-main-character');

    const revealAllImmediately = () => {
      l1?.classList.add('visible');
      l2?.classList.add('visible');
      l3?.classList.add('visible');
      l4?.classList.add('visible');
      if (btn) {
        btn.classList.add('visible');
        btn.removeAttribute('disabled');
      }
    };

    // Staggered cinematic reveal
    setTimeout(() => l1?.classList.add('visible'), 400);
    setTimeout(() => l2?.classList.add('visible'), 1600);
    setTimeout(() => l3?.classList.add('visible'), 2800);
    setTimeout(() => l4?.classList.add('visible'), 4000);
    setTimeout(() => {
      if (btn) {
        btn.classList.add('visible');
        btn.removeAttribute('disabled');
      }
    }, 5200);

    // Fast-forward on click
    const scene05 = document.getElementById('scene-05');
    if (scene05) {
      scene05.addEventListener('click', revealAllImmediately, { once: true });
    }
  }

  triggerGrandCurtainOpening() {
    const theatreStage = document.getElementById('grand-theatre-stage');
    if (window.cinematicAudio) {
      window.cinematicAudio.playCurtainSweepSound();
      window.cinematicAudio.setSceneMood(6);
    }

    if (theatreStage) {
      theatreStage.classList.add('curtains-opened');
    }

    setTimeout(() => {
      if (window.sceneNav) {
        window.sceneNav.goToScene(6);
      }
    }, 1800);
  }

  /* --------------------------------------------------------------------------
     SCENE 06 — Curated Archive & Restart
     -------------------------------------------------------------------------- */
  setupArchiveToggle() {
    const archiveBtn = document.getElementById('btn-toggle-archive');
    const archiveContainer = document.getElementById('archive-gallery-container');
    const restartBtn = document.getElementById('btn-restart-experience');

    if (archiveBtn && archiveContainer) {
      archiveBtn.addEventListener('click', () => {
        const isExpanded = archiveContainer.classList.contains('expanded');
        if (isExpanded) {
          archiveContainer.classList.remove('expanded');
          archiveBtn.innerHTML = 'VIEW THE ARCHIVE: GLIMPSES OF A JOURNEY <span class="btn-arrow">↓</span>';
        } else {
          archiveContainer.classList.add('expanded');
          archiveBtn.innerHTML = 'HIDE ARCHIVE <span class="btn-arrow">↑</span>';
        }
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.resetExperience();
        if (window.sceneNav) {
          window.sceneNav.goToScene(1);
        }
      });
    }
  }

  resetExperience() {
    this.exploredExhibits.clear();
    this.isLetterOpened = false;
    this.isMuseumDoorsOpened = false;
    this.currentWingIndex = 0;
    this.closeFinalGallery();
    this.closeCuratorModal();

    // Reset Museum Elements
    const entranceDoors = document.getElementById('museum-entrance-doors');
    const foyerView = document.getElementById('museum-foyer-view');
    const hallwayView = document.getElementById('museum-hallway-view');
    const hallwayTrack = document.getElementById('museum-wings-track');
    const chamber05 = document.getElementById('wing-chamber-masterpiece');
    const btnEnterFinal = document.getElementById('btn-enter-final-gallery');
    const wingDot5 = document.querySelector('.museum-wing-tab[data-wing="4"]');
    const curtainLeft = document.getElementById('curtain-left');
    const curtainRight = document.getElementById('curtain-right');

    if (entranceDoors) entranceDoors.classList.remove('doors-open');
    if (foyerView) foyerView.classList.remove('foyer-passed');
    if (hallwayView) hallwayView.classList.remove('hallway-entered');
    if (hallwayTrack) hallwayTrack.style.transform = 'translateX(0%)';
    if (chamber05) chamber05.classList.remove('unlocked');
    if (curtainLeft) curtainLeft.style.transform = '';
    if (curtainRight) curtainRight.style.transform = '';

    if (wingDot5) {
      wingDot5.classList.add('tab-locked');
      wingDot5.innerHTML = '05. Masterpiece 🔒';
    }
    if (btnEnterFinal) {
      btnEnterFinal.setAttribute('disabled', 'true');
      btnEnterFinal.classList.add('disabled');
      btnEnterFinal.innerHTML = 'Explore Exhibits 1–4 to Unlock <span class="btn-arrow">🔒</span>';
    }

    // Reset all chamber cards
    const chambers = document.querySelectorAll('.wing-chamber');
    chambers.forEach(c => c.classList.remove('visited', 'explored'));

    // Reset Letter
    const seal = document.getElementById('envelope-seal');
    const flap = document.getElementById('envelope-flap');
    const openBtn = document.getElementById('btn-open-letter');
    const letterPaper = document.getElementById('letter-paper');
    if (seal) seal.classList.remove('seal-breaking');
    if (flap) flap.classList.remove('flap-opening');
    if (openBtn) {
      openBtn.style.opacity = '1';
      openBtn.style.pointerEvents = 'auto';
    }
    if (letterPaper) letterPaper.classList.remove('open');

    // Reset Theatre & Scene 5/6
    const theatreStage = document.getElementById('grand-theatre-stage');
    const scene05 = document.getElementById('scene-05');
    const scene06 = document.getElementById('scene-06');
    const archiveContainer = document.getElementById('archive-gallery-container');
    const archiveBtn = document.getElementById('btn-toggle-archive');

    if (theatreStage) theatreStage.classList.remove('curtains-opened');
    if (scene05) scene05.classList.remove('spotlight-active');
    if (scene06) scene06.classList.remove('reveal-active');
    if (archiveContainer) archiveContainer.classList.remove('expanded');
    if (archiveBtn) archiveBtn.innerHTML = 'VIEW THE ARCHIVE: GLIMPSES OF A JOURNEY <span class="btn-arrow">↓</span>';

    this.updateProgressUI();

    // Reset music mood to scene 1
    if (window.cinematicAudio) {
      window.cinematicAudio.setSceneMood(1);
    }
  }
}

// Global instance
window.sceneAnimations = new SceneAnimationController();
