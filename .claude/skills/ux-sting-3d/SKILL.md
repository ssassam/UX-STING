---
name: ux-sting-3d
description: "Build three.js (WebGL/WebGPU) 3D and shader moments for UX-STING sites — hero scenes, product viewers, particle or shader backgrounds, scroll-driven 3D — that stay fast, accessible and on-theme. Use when asked for 3D, WebGL, WebGPU, three.js, shaders, TSL, GLTF models or an immersive/award-style hero, and when a non-templated site needs a signature visual."
---

# UX-STING 3D — three.js that earns its weight

Source of truth for three.js APIs is the library's own LLM guide: <https://threejs.org/docs/llms.txt> (full: `llms-full.txt`). Fetch it when unsure; do not rely on memory of old APIs.

## 1. Decide if 3D belongs
- One signature 3D moment per page (hero, product viewer, one section). Not on app UI, forms, or anything people need to read first.
- If a `MeshGradient`, `Grain`, `Spotlight`, `Tilt` or CSS effect from `packages/react` gives the same feeling, use that instead (zero JS cost).
- State the direction first (`ux-sting-taste`): the 3D style must match the type, palette and composition, not be bolted on.

## 2. three.js rules (from the official guide)
- Install `three` from npm (`pnpm add three` + `@types/three`); in standalone HTML use an **import map** with `three` and `three/addons/` from jsDelivr at one pinned version. Never the old `<script src=".../three.min.js">` pattern.
- `WebGLRenderer` by default (widest support). `WebGPURenderer` (`import * as THREE from "three/webgpu"`, `await renderer.init()`) only for TSL node materials or compute; it falls back to WebGL2.
- Custom shaders: TSL (`three/tsl`) with `*NodeMaterial` classes, not string GLSL or `onBeforeCompile`, when on WebGPURenderer.
- Addons come from `three/addons/...` (`OrbitControls`, `GLTFLoader`, `DRACOLoader`, `RoomEnvironment`).

## 3. Integrating with Next.js / React
- A `"use client"` component, loaded with `next/dynamic(() => import("./scene"), { ssr: false })`, so three.js is never in the server bundle or the first-load JS of other routes.
- The server renders a **poster**: an `Image` still of the scene with real `alt`, same aspect ratio (no layout shift). The canvas replaces it only after the first frame renders.
- Lifecycle in one `useEffect`: create renderer → `renderer.setAnimationLoop(tick)` → on cleanup `setAnimationLoop(null)`, dispose geometries, materials, textures and `renderer.dispose()`. Strict Mode mounts twice — cleanup must be complete.
- Size with a `ResizeObserver` on the container (not `window`); `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`.
- Pause when off screen with `useInView` from `@ux-sting/hooks` and when `document.hidden`.
- React Three Fiber (`@react-three/fiber`, `drei`) is fine for scenes with many interactive objects; plain three.js is lighter for one effect. Pick one per project.

## 4. Theme
- Read colors from tokens at runtime: `getComputedStyle(el).getPropertyValue("--ui-primary")` → `oklchToHex()` from `@ux-sting/tokens` → `new THREE.Color(hex)` (THREE.Color does not parse OKLCH). Re-read on color-mode change.
- Transparent canvas (`alpha: true`) over `--ui-background` so light, dark and high-contrast modes keep working. In forced-colors mode show the poster.
- Timing from motion tokens (`--ui-duration-*`, `--ui-ease-*`) for UI-linked transitions.

## 5. Accessibility (non-negotiable)
- `prefers-reduced-motion: reduce` → render one still frame (or keep the poster); no autoplaying camera moves, parallax or particles.
- The canvas is decorative (`aria-hidden="true"`) unless interactive. Everything it communicates is also in text.
- Interactive viewers (orbit/zoom): keyboard controls or buttons for rotate/zoom/reset, visible focus, a pause button for anything moving > 5 s (WCAG 2.2.2), and never trap page scroll — use `controls.enableZoom = false` or require a modifier/focus.
- No flashing > 3 times per second.
- WebGL unavailable or context lost (`webglcontextlost`) → keep the poster; never a blank box or an error.

## 6. Performance budget
- three.js (core + WebGL renderer) is ~190 kB gzip before addons: lazy-load it below the fold or after LCP; the poster is the LCP element, not the canvas.
- Models: glTF/GLB, Draco or Meshopt compressed, KTX2 textures, < 2 MB per scene; `InstancedMesh` for repeats; ≤ ~100 draw calls on mobile.
- Avoid real-time shadows and post-processing on mobile unless the scene is the product. Lower DPR and particle counts on `(pointer: coarse)` and when `navigator.hardwareConcurrency <= 4`.
- Measure: Lighthouse/LCP/INP with and without the scene; record the numbers in the report.

## 7. Review
Run the page at 1280 and 390 px, light and dark, with reduced motion on and off, and with WebGL disabled; look at the screenshots yourself (`ux-sting-review`). Report what was measured and on which device class; do not claim 60 fps you did not measure.
