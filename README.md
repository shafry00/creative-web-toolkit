# Creative Web Toolkit 🎨

> Toolkit untuk bikin website kreatif: anti-gravity, 3D, motion, aesthetic effects

## Apa Isinya

Toolkit ini nyediain semua yang dibutuhkan buat bikin website dengan efek-efek visual yang gak biasa:

### 🎯 Demo Templates

| Demo | Deskripsi | Tech |
|------|-----------|------|
| **Anti-Gravity** | Elemen melayang, physics simulation | Three.js, Cannon.js |
| **3D Scroll** | Scroll-driven 3D scenes | Three.js, GSAP ScrollTrigger |
| **Aesthetic** | Glitch effects, distorted text, abstract visuals | WebGL, GLSL Shaders |
| **Motion** | Smooth transitions, parallax, kinetic typography | GSAP, Framer Motion |
| **Persona Style** | Menu-style navigation dengan sound effects | Vanilla JS, CSS |

### 🧩 Shared Components

- **Scene3D** — Setup Three.js scene yang bisa dipakai ulang
- **PhysicsWorld** — Physics simulation (gravity, collision, spring)
- **ScrollAnimation** — Scroll-driven animations
- **ShaderLibrary** — Kumpulan GLSL shaders (glitch, noise, distortion)
- **TextEffect** — Text animations (typewriter, glitch, kinetic)
- **CursorCustom** — Custom cursor dengan trail effects

### 🛠 Utilities

- **useThree** — React hook untuk Three.js setup
- **useGSAP** — React hook untuk GSAP animations
- **useScroll** — Scroll position tracking
- **useMouse** — Mouse position tracking (buat interactive effects)
- **easing** — Custom easing functions

## Tech Stack

```
Core:     Three.js + React Three Fiber
Animation: GSAP + Framer Motion
Styling:  Tailwind CSS
Build:    Vite
Scroll:   Lenis (smooth scroll)
Physics:  Cannon.js / Rapier
```

## Quick Start

```bash
# Install dependencies
npm install

# Run demo
npm run dev

# Build for production
npm run build
```

## Struktur

```
creative-web-toolkit/
├── src/
│   ├── components/        # Shared 3D & UI components
│   │   ├── Scene3D.jsx
│   │   ├── PhysicsWorld.jsx
│   │   ├── TextEffect.jsx
│   │   └── CursorCustom.jsx
│   ├── shaders/           # GLSL shader library
│   │   ├── glitch.glsl
│   │   ├── noise.glsl
│   │   └── distortion.glsl
│   ├── hooks/             # React hooks
│   │   ├── useThree.js
│   │   ├── useGSAP.js
│   │   ├── useScroll.js
│   │   └── useMouse.js
│   └── utils/             # Utility functions
│       ├── easing.js
│       └── math.js
├── demos/                 # Demo templates
│   ├── gravity/           # Anti-gravity physics
│   ├── 3d-scroll/         # 3D scroll-driven
│   ├── aesthetic/         # Glitch & abstract
│   ├── motion/            # Smooth transitions
│   └── persona/           # Persona 5 style
├── templates/             # Starter templates
│   ├── portfolio/
│   ├── landing-page/
│   └── showcase/
└── public/
    └── assets/
```

## Cara Pakai

### 1. Pilih Demo Template
```bash
cd demos/gravity
npm run dev
```

### 2. Customize
Edit `model.js` atau component files sesuai kebutuhan.

### 3. Deploy
```bash
npm run build
# Deploy ke Vercel/Netlify/Cloudflare Pages
```

## Inspirasi

- [Google Anti-Gravity](https://antigravity.google/) — Physics simulation
- [21st.dev](https://21st.dev) — Polished React components
- [Codrops Creative Hub](https://tympanus.net/codrops/hub/) — Web experiments
- [Three.js Examples](https://threejs.org/examples/) — 3D demos
- [GSAP Showcase](https://gsap.com/showcase/) — Animation examples

## License

MIT
