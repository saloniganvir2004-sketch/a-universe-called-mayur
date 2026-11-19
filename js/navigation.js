/* ==========================================================================
   A UNIVERSE CALLED MAYUR — Navigation & State Machine
   Strict Scene State Management • Transition Locking • Music Mood Sync
   ========================================================================== */

class SceneNavigationEngine {
  constructor() {
    this.currentScene = 1;
    this.totalScenes = 6;
    this.isTransitioning = false;
    this.chapterNumberEl = document.getElementById('chapter-current-num');
    this.chapterDots = document.querySelectorAll('.chapter-dot');

    this.init();
  }

  init() {
    this.setupScene01Buttons();
    this.setupScene02Buttons();
    this.setupChapterDotNavigation();
    this.updateChapterUI(1);
  }

  /* Scene 01: Create Our Universe & Enter Your Universe */
  setupScene01Buttons() {
    const btnCreate = document.getElementById('btn-create-universe');
    const btnEnter = document.getElementById('btn-enter-universe');

    // Button 1: "CREATE OUR UNIVERSE"
    if (btnCreate) {
      btnCreate.addEventListener('click', () => {
        if (window.cosmicEffects) {
          window.cosmicEffects.triggerUniverseCreation();
        }
      });
    }

    // Button 2: "ENTER YOUR UNIVERSE →"
    if (btnEnter) {
      btnEnter.addEventListener('click', () => {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        btnEnter.disabled = true;

        // Trigger cosmic warp travel effect
        if (window.cosmicEffects) {
          window.cosmicEffects.triggerWarpTransition(() => {
            this.goToScene(2);
            this.isTransitioning = false;
            btnEnter.disabled = false;
          });
        } else {
          this.goToScene(2);
          this.isTransitioning = false;
          btnEnter.disabled = false;
        }
      });
    }
  }

  /* Scene 02: Discover What The Universe Has Left For You */
  setupScene02Buttons() {
    const btnDiscover = document.getElementById('btn-discover-world');
    const artifact = document.getElementById('interactive-golden-artifact');

    const handleScene02Advance = () => {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      if (btnDiscover) btnDiscover.disabled = true;

      // Pulse artifact & earth approach zoom
      const earthSphere = document.querySelector('.earth-sphere');
      if (earthSphere) {
        earthSphere.classList.add('earth-approach-active');
      }

      if (window.cinematicAudio) {
        window.cinematicAudio.playBigBangSound();
      }

      setTimeout(() => {
        this.goToScene(3);
        this.isTransitioning = false;
        if (btnDiscover) btnDiscover.disabled = false;
        if (earthSphere) earthSphere.classList.remove('earth-approach-active');
      }, 1400);
    };

    if (btnDiscover) btnDiscover.addEventListener('click', handleScene02Advance);
    if (artifact) artifact.addEventListener('click', handleScene02Advance);
  }

  setupChapterDotNavigation() {
    this.chapterDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetScene = parseInt(dot.getAttribute('data-scene'), 10);
        // Only allow jumping to already unlocked scenes or current scene
        if (targetScene && !this.isTransitioning && targetScene <= this.currentScene) {
          this.goToScene(targetScene);
        }
      });
    });
  }

  goToScene(targetSceneNum) {
    if (targetSceneNum < 1 || targetSceneNum > this.totalScenes) return;

    const currentEl = document.getElementById(`scene-0${this.currentScene}`);
    const targetEl = document.getElementById(`scene-0${targetSceneNum}`);

    if (currentEl) currentEl.classList.remove('active');
    if (targetEl) targetEl.classList.add('active');

    this.currentScene = targetSceneNum;
    this.updateChapterUI(targetSceneNum);

    // Sync Audio Engine Mood
    if (window.cinematicAudio) {
      window.cinematicAudio.setSceneMood(targetSceneNum);
    }

    // Sync Canvas Effects
    if (window.cosmicEffects) {
      window.cosmicEffects.setActiveScene(targetSceneNum);
    }

    // Trigger scene-specific reveals
    this.handleSceneActivation(targetSceneNum);
  }

  handleSceneActivation(sceneNum) {
    if (sceneNum === 2) {
      const scene02 = document.getElementById('scene-02');
      if (scene02) {
        setTimeout(() => scene02.classList.add('elements-revealed'), 350);
      }
    } else if (sceneNum === 4) {
      // Ensure gallery artwork is crisp
      if (window.sceneAnimations) {
        window.sceneAnimations.renderAllWingArtwork();
      }
    } else if (sceneNum === 5) {
      if (window.sceneAnimations) {
        window.sceneAnimations.triggerSpotlightSceneStart();
      }
    } else if (sceneNum === 6) {
      const scene06 = document.getElementById('scene-06');
      if (scene06) {
        setTimeout(() => scene06.classList.add('reveal-active'), 500);
      }
    }
  }

  updateChapterUI(sceneNum) {
    if (this.chapterNumberEl) {
      this.chapterNumberEl.textContent = `0${sceneNum} / 06`;
    }

    this.chapterDots.forEach((dot, index) => {
      const dotScene = index + 1;
      dot.classList.remove('active', 'completed');
      if (dotScene === sceneNum) {
        dot.classList.add('active');
      } else if (dotScene < sceneNum) {
        dot.classList.add('completed');
      }
    });
  }
}

// Global instance
window.sceneNav = new SceneNavigationEngine();
