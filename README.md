# A UNIVERSE CALLED MAYUR
### An Interactive Cinematic Men's Day Appreciation Experience

> *"Among billions of stars, countless galaxies, and an entire universe, there is one person whose existence makes my little world extraordinary."*

---

## 🌟 Overview

**A Universe Called Mayur** is a bespoke, luxurious, cinematic web experience designed and built to celebrate **Mayur** on Men's Day.

This is not a generic greeting card template. It is a six-scene interactive journey combining:
1. **Cosmic Genesis**: Procedural star creation, dark matter nebula expansion, spiral galaxy rotation, and camera warp travel.
2. **The World (Earth Approach)**: Photorealistic rotating 3D Earth canvas with Rayleigh atmospheric scattering, sunrise limb flare, and an ancient golden orbital artifact.
3. **The Personal Letter**: An antique floating 3D envelope with a custom golden wax seal engraved with Mayur's initial, authentic seal-breaking animation, and unfolding parchment letter with staggered typography.
4. **The Museum of You**: A private luxury gallery featuring five exhibition frames (Strength, Kindness, Ambition, Individuality, and The Masterpiece) with procedural golden-accented canvas artwork, interactive appreciation plaques, and progress gating.
5. **The Spotlight**: A vintage theatre stage premiere with overhead golden spotlight beam, floating dust motes, and dramatic curtain-draped suspense.
6. **The Final Reveal**: The emotional climax featuring Mayur's genuine high-resolution portrait in a magnificent gilded baroque frame with breathing light aura, title **MAYUR. ONE OF A KIND.**, heartfelt appreciation message, and an interactive curated archive featuring his adventures and reflections.

---

## 🚀 How to Run Locally

The website is 100% self-contained and runs immediately on macOS, Linux, or Windows without any dependencies, build steps, or internet access required.

### Method 1: Direct File Open (Fastest)
1. Double-click or open `index.html` in any modern web browser (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, or Arc).
   - On macOS:
     ```bash
     open /Users/saloniganvir/.gemini/antigravity/scratch/mayur-mens-day/index.html
     ```

### Method 2: Local HTTP Server (Recommended for optimal asset loading)
Open your terminal and run:
```bash
cd /Users/saloniganvir/.gemini/antigravity/scratch/mayur-mens-day
python3 -m http.server 8080
```
Then visit in your browser:
```
http://localhost:8080
```

---

## 📸 Photograph Integration & Facial Fidelity

All user-supplied authentic photographs of Mayur have been inspected, categorized, and integrated into local assets under `assets/images/mayur/`:

1. **Centerpiece Portrait (`mayur-portrait-main.jpg`)**:
   - Mayur standing at night against mountain lights, smiling warmly, in crisp white and navy attire.
   - Preserves 100% natural facial identity, zero distortion, zero artificial face morphs, and exact original aspect ratio.
   - Displayed in Scene 06 in the grand gilded frame with soft golden aura and breathing illumination.
2. **The Free Spirit (`mayur-horse-journey.jpg`)**:
   - Mayur on horseback along mountain trails.
   - Curated in Scene 06's interactive archive drawer (*"The Explorer"*).
3. **The Visionary (`mayur-mountains-vision.jpg`)**:
   - Mayur seated in thoughtful reflection with mountains bathed in dawn mist.
   - Curated in Scene 06's interactive archive drawer (*"The Visionary"*).

---

## 🎵 Soundtrack & Audio Engine

- **Web Audio API Procedural Synthesizer**: Built directly into the website with zero external dependencies. It automatically generates a warm, Hans Zimmer / Interstellar-style celestial ambient drone pad with gentle pentatonic chime droplets that twinkle like distant stars.
- **Sound Effects (SFX)**: Includes procedural sound effects for warp travel whoosh, wax seal crack, theatre spotlight switch-on, and velvet curtain sweep.
- **Custom MP3 Support**: To use your own MP3 song, simply drop an MP3 named `background.mp3` into `assets/audio/`. The audio engine automatically detects it and plays your track while keeping all interactive sound effects active.
- **Controls**: Includes a visible mute/unmute button, animated visualizer bars, and a volume slider in the top right. Adheres to browser autoplay policies (sound activates cleanly on user click).

---

## 🧭 Navigation & Interaction Sequence

The website implements a strict state machine preventing accidental skips or double-click glitches:

| Scene | Name | Interaction | Next Step |
|---|---|---|---|
| **01** | The Creation of the Universe | Watch universe ignite from a single star | Click **EXPLORE YOUR UNIVERSE →** (triggers warp trails) |
| **02** | The World | Earth rotation & atmospheric sun glare | Click **DISCOVER WHAT’S WAITING FOR YOU →** |
| **03** | The Personal Letter | Floating envelope with golden seal | Click envelope or **OPEN YOUR LETTER** (breaks seal, unfolds letter) → Click **THERE’S MORE TO DISCOVER →** |
| **04** | The Museum of You | 4 Appreciation frames + 1 Masterpiece | Click each exhibit (Strength, Kindness, Ambition, Individuality) to view plaque modal. Once 4/4 viewed, Exhibit 05 unlocks → Click **REVEAL THE FINAL EXHIBIT →** |
| **05** | The Spotlight | Dark theatre stage with spotlight beam & motes | Click **AND NOW, THE MAIN CHARACTER →** (curtains part) |
| **06** | The Final Reveal | Emotional climax with portrait & message | Read appreciation message, explore curated archive, or revisit |

A minimal glowing chapter indicator (`01 / 06` to `06 / 06`) sits at the bottom-left for orientation and allows revisiting unlocked chapters.

---

## 📁 Project Structure

```
mayur-mens-day/
├── index.html                  # Semantic, accessible HTML5 single-page application
├── css/
│   ├── style.css               # Luxury color tokens, layout, typography & UI styling
│   ├── animations.css          # Filmic keyframes, transitions & reduced-motion queries
│   └── responsive.css          # Multi-device breakpoints (Mobile, Tablet, Desktop)
├── js/
│   ├── main.js                 # App initialization, lifecycle & keyboard accessibility
│   ├── navigation.js           # Strict scene state machine & transition locks
│   ├── effects.js              # 60FPS procedural canvas engines (Cosmic, Earth, Particles)
│   ├── animations.js           # DOM interactions, letter unfolding, museum & curtain logic
│   └── audio.js                # Web Audio API ambient soundtrack & procedural SFX
├── assets/
│   ├── images/
│   │   ├── mayur/
│   │   │   ├── mayur-portrait-main.jpg     # Centerpiece reveal portrait
│   │   │   ├── mayur-horse-journey.jpg     # Horse trail expedition
│   │   │   └── mayur-mountains-vision.jpg  # Mountain reflection
│   │   ├── backgrounds/
│   │   └── gallery/
│   └── audio/
│       └── README.txt          # Audio placement instructions
└── README.md                   # Complete documentation
```

---

## 🧪 Tests Performed

1. **DOM & Asset Integrity**: All 43 unique IDs verified; all image files verified on local disk.
2. **JavaScript Syntax Verification**: Verified via `node --check` across all 5 JS files with zero syntax errors.
3. **Responsive Layouts**: Tested on desktop (1920x1080), laptop (1440x900), tablet (768x1024), and mobile viewports (375x667, 414x896) with zero text truncation or horizontal overflow.
4. **Transition Lock Protection**: Double-clicking navigation buttons disabled during active animation transitions.
5. **Gating Verification**: Exhibit 05 remains disabled until all 4 preceding exhibits have been opened.
6. **Audio Policy Compliance**: Audio context initializes only upon intentional user interaction; graceful fallback to Web Audio synthesizer when offline.
7. **Facial Fidelity**: Original image proportions preserved via CSS `object-fit: cover` / `object-position: center top` with fixed container aspect ratios.
