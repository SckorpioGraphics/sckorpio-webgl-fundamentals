# WebGL Fundamentals

A practical WebGL learning repo focused on shaders, geometry, primitive rendering, dynamic buffers, and basic transform math.

## Current project structure

This repository currently contains the following chapter groups:

- Root: `chapter0.js` — standalone WebGL setup / reference boilerplate
- `chapter01/` — `chapter1a.js` — first triangle and basic WebGL setup
- `chapter02/` — `chapter2a.js` to `chapter2d.js` — multiple triangles, rectangle, index buffer, and letter F geometry
- `chapter03/` — `chapter3a.js` to `chapter3h.js` — primitive topology experiments
- `chapter04/` — `chapter4a.js` to `chapter4d.js` — dynamic buffer and interactive geometry examples
- `chapter05/` — `chapter5a.js` to `chapter5e.js` — uniforms, varying values, and buffer organization
- `chapter06/` — `chapter6a.js` to `chapter6e.js` — render loop and 2D transformation work
- `chapter07/` — reserved folder for future lessons
- `chapter11/`, `chapter12/`, `chapter21/` — folders present but currently empty placeholders
- `chapterExtra/` — `chapterExtra1.js` — extra render-loop / projection experiment

## Chapter overview

### chapter01
- `chapter1a.js` — Creating a Basic Triangle

### chapter02
- `chapter2a.js` — Multiple Triangles
- `chapter2b.js` — Rectangle using Triangles
- `chapter2c.js` — Index Buffer
- `chapter2d.js` — Letter F geometry

### chapter03
- `chapter3a.js` — POINTS
- `chapter3b.js` — LINES
- `chapter3c.js` — additional line pattern
- `chapter3d.js` — LINE_LOOP
- `chapter3e.js` — LINE_LOOP / polygon-style drawing
- `chapter3f.js` — TRIANGLES
- `chapter3g.js` — TRIANGLE_STRIP
- `chapter3h.js` — TRIANGLE_FAN

### chapter04
- `chapter4a.js` — Dynamic Buffer
- `chapter4b.js` — Dynamic Buffer / rectangle editing
- `chapter4c.js` — topology or polygon experiment
- `chapter4d.js` — interactive drawing experiment

### chapter05
- `chapter5a.js` — Uniform color
- `chapter5b.js` — Varying color
- `chapter5c.js` — Multiple buffers
- `chapter5d.js` — Combined buffer
- `chapter5e.js` — Varying + Uniform together

### chapter06
- `chapter6a.js` — basic rectangle in pixel space using `u_resolution`
- `chapter6b.js` — same screen-space rectangle with inverted Y handling
- `chapter6c.js` — many random rectangles using a single buffer and uniform colors
- `chapter6d.js` — same random-rectangle idea with render-loop style progression
- `chapter6e.js` — 2D transforms using 3x3 matrices for translation, rotation, and scaling

### chapterExtra
- `chapterExtra1.js` — extra render-loop / projection experiments

## Learning flow

This project is organized as a step-by-step path:

1. Create a first triangle
2. Build geometry with triangles and indices
3. Explore primitive topologies
4. Make data dynamic and interactive
5. Pass data through shaders using uniforms and varying values
6. Add render loops and transforms
7. Extend toward more advanced graphics ideas

## Tech focus

- WebGL 2.0
- GLSL ES 3.00
- Buffers, VAOs, and shaders
- Geometry assembly and index drawing
- Primitive modes and topology
- Shader data flow
- Matrix-based 2D transforms

Part of the Sckorpio Graphics learning series.

