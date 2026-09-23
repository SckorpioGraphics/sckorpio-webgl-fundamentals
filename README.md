# WebGL Fundamentals

A practical WebGL learning repo focused on shaders, geometry, primitive rendering, dynamic buffers, pixel-space math, and matrix-based 2D transforms.

## Current project structure

This repository follows a clear WebGL learning sequence:

- Root: `chapter0.js` — standalone WebGL setup / reference boilerplate
- `chapter01/` — `chapter1a.js` — basic triangle and first WebGL draw
- `chapter02/` — `chapter2a.js` to `chapter2d.js` — geometry and index buffer fundamentals
- `chapter03/` — `chapter3a.js` to `chapter3h.js` — primitive topology experiments
- `chapter04/` — `chapter4a.js` to `chapter4d.js` — dynamic buffers and interactive drawing
- `chapter05/` — `chapter5a.js` to `chapter5e.js` — varying / interpolated shader data
- `chapter06/` — `chapter6a.js` to `chapter6e.js` — uniforms and shader-controlled values
- `chapter07/` — `chapter7a.js` to `chapter7e.js` — pixel-space rendering and screen-space conversion
- `chapter08/` — `chapter8a.js` and `chapter8b.js` — 2D transformations and matrix-driven motion
- `chapter11/`, `chapter12/`, `chapter21/` — present in the repo but still empty placeholder lesson files
- `chapterExtra/` — `chapterExtra1.js` — extra render-loop / projection experiments

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
- `chapter5a.js` — Varying: vertex position drives vertex colors
- `chapter5b.js` — Multiple buffers: position and color in separate buffers
- `chapter5c.js` — Interleaved buffer: position + color in one buffer
- `chapter5d.js` — Gradient rectangle using interpolated vertex colors
- `chapter5e.js` — Rectangle with two triangles and different vertex colors

This chapter focuses on `varying` variables and how color data is interpolated across fragments.

### chapter06
- `chapter6a.js` — Uniform float intensity
- `chapter6b.js` — Uniform color channels and intensity
- `chapter6c.js` — Random rectangles using uniform-driven color updates
- `chapter6d.js` — Repeated draw work with uniform-based control
- `chapter6e.js` — Full uniform examples and broader shader parameter control

This chapter is the formal `uniforms` chapter: values are set from JavaScript and shared across vertices/fragments without per-vertex interpolation.

### chapter07
- `chapter7a.js` — Basic rectangle in pixel space
- `chapter7b.js` — Pixel-space rectangle with inverted Y handling
- `chapter7c.js` — Matrix-based pixel-to-clip conversion
- `chapter7d.js` — Many random rectangles with uniform colors
- `chapter7e.js` — Follow-up pixel-space random rectangle pattern

This chapter is about `pixel-space rendering`: drawing in screen coordinates instead of clip space, and converting from pixels to clip-space math.

### chapter08
- `chapter8a.js` — 2D Transformations
- `chapter8b.js` — 2D View & Translation Matrix

This chapter covers transform pipelines using matrices, translation, scale, and model/view/projection-style thinking.

### chapter11, chapter12, chapter21
- `chapter11a.js`, `chapter12a.js`, `chapter21a.js` — repo placeholders; currently empty

### chapterExtra
- `chapterExtra1.js` — extra render-loop / projection experiments

## Learning flow

This project is organized as a step-by-step path:

1. Create a first triangle and understand the basic draw pipeline
2. Build geometry with triangles and indexes
3. Explore primitive topologies and vertex arrangement
4. Make data dynamic and interactive with buffer updates
5. Learn `varying` for per-vertex to per-fragment interpolation
6. Learn `uniforms` for controlling shader behavior globally
7. Move into pixel-space rendering and screen-space conversion
8. Finish with transforms and matrix-based movement
9. Extend toward advanced rendering ideas and animation patterns

## Tech focus

- WebGL 2.0
- GLSL ES 3.00
- Buffers, VAOs, and shaders
- Geometry assembly and index drawing
- Primitive modes and topology
- Shader data flow
- `varying` interpolation
- `uniform` parameter control
- Screen-space conversion and pixel-space math
- Matrix-based 2D transforms and view-model pipelines

Part of the Sckorpio Graphics learning series.

