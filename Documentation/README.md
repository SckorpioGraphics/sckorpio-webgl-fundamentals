# WebGL Fundamentals Index

This documentation reflects the current repository layout and the examples that are present in the project today.

## Repository overview

The project is a practical WebGL study path. It starts with a basic triangle, moves into geometry and indexing, explores primitive topologies, then covers shader data flow, dynamic buffers, and 2D transforms.

## Current folders and files

### Root files
- `chapter0.js` — standalone setup and reference boilerplate

### chapter01
- `chapter1a.js` — basic triangle setup and first WebGL draw call

### chapter02
- `chapter2a.js` — multiple triangles
- `chapter2b.js` — rectangle built from triangles
- `chapter2c.js` — index buffer example
- `chapter2d.js` — geometric letter F construction

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
- `chapter4a.js` — dynamic buffer example
- `chapter4b.js` — dynamic rectangle / vertex editing
- `chapter4c.js` — topology or polygon experiment
- `chapter4d.js` — interactive drawing experiment

### chapter05
- `chapter5a.js` — uniform color
- `chapter5b.js` — varying color
- `chapter5c.js` — multiple buffers
- `chapter5d.js` — combined buffer
- `chapter5e.js` — varying + uniform together

### chapter06
- `chapter6a.js` — basic rectangle in pixel space using `u_resolution`
- `chapter6b.js` — same screen-space conversion with inverted Y handling
- `chapter6c.js` — many random rectangles with one buffer and uniform color updates
- `chapter6d.js` — continued random rectangle work with render-loop progression
- `chapter6e.js` — 2D transformation lesson using matrix math and GUI controls

### chapter07
- empty folder, reserved for future lessons

### chapter11, chapter12, chapter21
- folders exist but currently contain no lesson files

### chapterExtra
- `chapterExtra1.js` — extra render-loop / projection experiment

## Learning progression

1. Setup WebGL and draw a triangle
2. Build geometry with triangles and indices
3. Explore primitive topologies
4. Update vertex data dynamically
5. Pass data to shaders using uniforms and varyings
6. Add render loops and transformation math
7. Extend toward more advanced graphics concepts

## Main learning goals

- WebGL 2.0 fundamentals
- Vertex buffers and validation of data flow
- Shader compilation and linking
- Geometry construction
- Primitive rendering modes
- Dynamic data updates
- Shader input/output flow
- 2D transforms and animation foundations

This project is designed as a practical learning path toward understanding the graphics pipeline and rendering architecture.
