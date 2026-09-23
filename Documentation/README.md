# WebGL Fundamentals Index

This documentation reflects the current repository layout and the examples that are present in the project today.

## Repository overview

The project is a practical WebGL study path. It starts with a basic triangle, moves into geometry and indexing, explores primitive topologies, then covers shader data flow, dynamic buffers, screen-space math, and matrix-based 2D transforms.

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
- `chapter5a.js` — `varying` with vertex colors generated from position
- `chapter5b.js` — separate position and color buffers
- `chapter5c.js` — interleaved position + color buffer
- `chapter5d.js` — gradient rectangle using interpolated color data
- `chapter5e.js` — two-triangle rectangle with different vertex colors

### chapter06
- `chapter6a.js` — uniform float intensity
- `chapter6b.js` — uniform RGB color values and intensity
- `chapter6c.js` — many random rectangles under uniform control
- `chapter6d.js` — repeated draw work with uniform-driven styling
- `chapter6e.js` — full uniform examples for shader parameter control

### chapter07
- `chapter7a.js` — basic rectangle in pixel space
- `chapter7b.js` — pixel-space rectangle with inverted Y handling
- `chapter7c.js` — matrix-based pixel-to-clip conversion
- `chapter7d.js` — repeated random rectangles with uniform colors
- `chapter7e.js` — follow-up variation on pixel-space drawing

### chapter08
- `chapter8a.js` — 2D Transformations
- `chapter8b.js` — 2D View & Translation Matrix

### chapter11, chapter12, chapter21
- `chapter11a.js`, `chapter12a.js`, and `chapter21a.js` — files exist, but are currently empty placeholders

### chapterExtra
- `chapterExtra1.js` — render-loop / projection experiment

## Learning progression

1. Setup WebGL and draw a triangle
2. Build geometry with triangles and indices
3. Explore primitive topologies
4. Update vertex data dynamically
5. Use `varying` to pass data from vertex shader to fragment shader
6. Use `uniform` values for global shader control
7. Move into pixel-space rendering and screen-space conversion
8. Apply transforms and matrix-based motion
9. Extend toward more advanced graphics concepts and animation patterns

## Main learning goals

- WebGL 2.0 fundamentals
- Vertex buffers and validation of data flow
- Shader compilation and linking
- Geometry construction
- Primitive rendering modes
- Dynamic data updates
- Shader input/output flow
- `varying` interpolation and color gradients
- `uniform` parameter control
- Screen-space conversion and pixel-space math
- 2D transforms and view-model pipelines

This project is designed as a practical learning path toward understanding the graphics pipeline and rendering architecture.
