# WebGL Fundamentals

A practical WebGL learning repo focused on shaders, geometry, dynamic buffers, screen-space math, and 2D transforms.

## Current repository status

This repository has expanded beyond the original chapter sequence. The current workspace contains active lesson files through chapter 11, plus a chapter 10 entry point used by the browser demo.

## Root project structure

- `index.html` — active browser entry point; currently loads `chapters/chapter10/chapter10a.js`
- `css/style.css` — shared page styling
- `chapters/` — lesson files separated by chapter
- `Documentation/` — project notes and chapter index
- `screenshots/` — visual references / captures

## Chapter inventory

### chapter01
- `chapter1a.js` — first triangle / WebGL setup
- `chapter1b.js` — additional setup and rendering variation

### chapter02
- `chapter2a.js` — multiple triangles
- `chapter2b.js` — rectangle built from triangles
- `chapter2c.js` — index buffer example
- `chapter2d.js` — geometric letter F using triangle composition

### chapter03
- `chapter3a.js` — POINTS topology
- `chapter3b.js` — LINES topology
- `chapter3c.js` — additional line-pattern experiment
- `chapter3d.js` — LINE_LOOP example
- `chapter3e.js` — polygon-style line drawing
- `chapter3f.js` — TRIANGLES drawing
- `chapter3g.js` — TRIANGLE_STRIP example
- `chapter3h.js` — TRIANGLE_FAN example

### chapter04
- `chapter4a.js` — dynamic buffer example
- `chapter4b.js` — dynamic rectangle / vertex editing
- `chapter4c.js` — polygon or topology experiment
- `chapter4d.js` — interactive drawing exercise

### chapter05
- `chapter5a.js` — vertex colors driven by varying data
- `chapter5b.js` — separate position and color buffers
- `chapter5c.js` — interleaved position + color buffer
- `chapter5d.js` — gradient rectangle with interpolated colors
- `chapter5e.js` — two-triangle colored rectangle

### chapter06
- `chapter6a.js` — uniform float control
- `chapter6b.js` — uniform RGB color input
- `chapter6c.js` — repeated random rectangle styling
- `chapter6d.js` — uniform-driven repeated drawing work
- `chapter6e.js` — broader shader parameter examples

### chapter07
- `chapter7a.js` — basic pixel-space rectangle
- `chapter7b.js` — pixel-space drawing with inverted Y handling
- `chapter7c.js` — matrix-based pixel-to-clip conversion
- `chapter7d.js` — random rectangles with color control

### chapter08
- `chapter8a.js` — 2D transformation basics
- `chapter8b.js` — view and translation matrix work
- `chapter8c.js` — continued transform experiments
- `chapter8d.js` — transformation/practice variation
- `chapter8e.js` — further matrix-driven motion examples

### chapter09
- `chapter9a.js` — additional geometry / rendering practice
- `chapter9b.js` — follow-up rendering experiment

### chapter10
- `chapter10a.js` — current browser demo entry used by `index.html`

### chapter11
- `chapter11a.js` — chapter scaffold / practice file
- `chapter11b.js` — follow-up lesson file

### chapterExtra
- `chapterExtra1.js` — extra render loop / projection experiment

## Learning progression

1. Set up a canvas and draw the first triangle
2. Build geometry from triangles and indexed data
3. Explore primitive topologies and draw modes
4. Update buffers dynamically and work with live vertex data
5. Pass data from vertex shader to fragment shader with `varying`
6. Control shader behavior globally with `uniform`
7. Move into pixel-space and screen-space conversion
8. Apply transforms and matrices for 2D motion
9. Continue into advanced render-loop and projection-oriented experiments

## Technical focus

- WebGL 2.0 / canvas rendering pipeline
- GLSL shader creation and compilation
- Vertex buffers, attribute setup, and draw calls
- Geometry assembly and primitive modes
- Shader data flow (`attribute`, `varying`, `uniform`)
- Dynamic render updates and per-frame animation
- Screen-space math and pixel-to-clip conversion
- Matrix-based 2D transforms and motion

## How to use

Open `index.html` in a browser to run the current active example. If you want to study a specific lesson, open the relevant script in `chapters/` and update the entry point in the page as needed.

This project is part of the Sckorpio Graphics WebGL learning path.

