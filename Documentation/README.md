# WebGL Fundamentals Index

This documentation reflects the current repository layout as it exists in the workspace today.

## Repository overview

The project is a practical WebGL study path covering the rendering pipeline, geometry construction, shader input/output, dynamic buffers, screen-space math, and 2D transforms.

## Current project structure

### Root-level files
- `index.html` — browser launch file; currently imports `chapters/chapter10/chapter10a.js`
- `css/style.css` — styling for the demo page
- `README.md` — project overview
- `Documentation/` — notes and chapter documentation
- `screenshots/` — visual examples and captures

### chapter01
- `chapter1a.js` — first triangle / initial WebGL setup
- `chapter1b.js` — follow-up setup / rendering variation

### chapter02
- `chapter2a.js` — multiple triangles
- `chapter2b.js` — rectangle from triangle composition
- `chapter2c.js` — index buffer example
- `chapter2d.js` — letter F geometry using triangles

### chapter03
- `chapter3a.js` — POINTS topology
- `chapter3b.js` — LINES topology
- `chapter3c.js` — line pattern experiment
- `chapter3d.js` — LINE_LOOP demo
- `chapter3e.js` — polygon-style line drawing
- `chapter3f.js` — TRIANGLES drawing
- `chapter3g.js` — TRIANGLE_STRIP example
- `chapter3h.js` — TRIANGLE_FAN example

### chapter04
- `chapter4a.js` — dynamic buffer example
- `chapter4b.js` — dynamic rectangle / live vertex editing
- `chapter4c.js` — topology / polygon experiment
- `chapter4d.js` — interactive drawing study

### chapter05
- `chapter5a.js` — `varying` color data from positions
- `chapter5b.js` — multiple buffers for position and color
- `chapter5c.js` — interleaved attribute buffer
- `chapter5d.js` — gradient rectangle using interpolation
- `chapter5e.js` — multi-color two-triangle rectangle

### chapter06
- `chapter6a.js` — uniform float control
- `chapter6b.js` — uniform color control
- `chapter6c.js` — many colored rectangles under uniform control
- `chapter6d.js` — repeated draw experiments with uniforms
- `chapter6e.js` — broader shader parameter control

### chapter07
- `chapter7a.js` — basic pixel-space rectangle
- `chapter7b.js` — pixel-space rectangle with inverted Y handling
- `chapter7c.js` — matrix-based pixel-to-clip conversion
- `chapter7d.js` — random rectangles with uniform colors

### chapter08
- `chapter8a.js` — 2D transform basics
- `chapter8b.js` — view and translation matrix
- `chapter8c.js` — continued transform work
- `chapter8d.js` — transformation practice
- `chapter8e.js` — additional matrix-based motion example

### chapter09
- `chapter9a.js` — additional rendering experiment
- `chapter9b.js` — follow-up learning file

### chapter10
- `chapter10a.js` — current active example loaded by `index.html`

### chapter11
- `chapter11a.js` — active lesson scaffold
- `chapter11b.js` — continuation file

### chapterExtra
- `chapterExtra1.js` — projection / render-loop experiment

## Learning progression

1. Draw the first triangle and establish a WebGL canvas setup
2. Build geometry with triangles and indexed data
3. Explore primitive topology and draw modes
4. Update buffers dynamically with changing vertex data
5. Use `varying` to pass data between shader stages
6. Use `uniform` values to control shader output globally
7. Work in pixel-space and convert to clip space
8. Apply matrix transforms for 2D motion and composition
9. Extend the pipeline with render-loop and projection experiments

## Main learning goals

- WebGL 2.0 fundamentals
- Shader setup and program linking
- Buffers and attribute binding
- Geometry construction and primitive modes
- `varying` interpolation and color flow
- `uniform` parameter control
- Screen-space math and projective thinking
- Matrix-based transforms and motion
- Continued experimentation with rendering techniques

This project is designed as a practical learning path toward a working understanding of the graphics pipeline and WebGL fundamentals.
