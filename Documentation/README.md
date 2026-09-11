# WebGL Fundamentals Index

This documentation reflects the current repository layout and the examples that are actually present in the project.

## Repository overview

The project is a practical WebGL study path. It begins with basic triangle setup and gradually moves through geometry, rendering modes, shader data flow, and transforms.

## Current folders and files

### Root files
- `chapter0.js` — standalone setup/reference file

### chapter1
- `chapter1a.js` — basic triangle setup and first WebGL drawing example

### chapter2
- `chapter2a.js` — multiple triangles
- `chapter2b.js` — rectangle made from triangles
- `chapter2c.js` — index buffer and indexed drawing
- `chapter2d.js` — geometric shape (letter F)

### chapter3
- `chapter3a.js` — POINTS
- `chapter3b.js` — LINES
- `chapter3c.js` — additional line example
- `chapter3d.js` — LINE_LOOP
- `chapter3e.js` — LINE_LOOP / polygon-style shape
- `chapter3f.js` — TRIANGLES
- `chapter3g.js` — TRIANGLE_STRIP
- `chapter3h.js` — TRIANGLE_FAN

### chapter4
- `chapter4a.js` — dynamic buffer experiments
- `chapter4b.js` — dynamic buffer follow-up
- `chapter4c.js` — topology/data experiments
- `chapter4d.js` — more interactive drawing experiments

### chapter5
- `chapter5a.js` — uniform color
- `chapter5b.js` — varying color
- `chapter5c.js` — multiple buffers
- `chapter5d.js` — combined buffer
- `chapter5e.js` — varying + uniform together

### chapter6
- `chapter6a.js` to `chapter6e.js` — render loop and 2D transformation work

### chapterExtra
- `chapterExtra1.js` — bonus / extra experiments

### chapter7
- empty folder, reserved for future work

## Learning progression

1. Setup WebGL and draw a triangle
2. Build geometry with multiple triangles and rectangles
3. Use indices to reduce repeated vertex data
4. Explore primitive topologies
5. Update data dynamically in real time
6. Pass data to shaders through uniforms and varying values
7. Add render loops and transformation math

## Main learning goals

- WebGL 2.0 fundamentals
- Vertex buffers and VAOs
- Shader compilation and linking
- Geometry construction
- Primitive rendering modes
- Dynamic data updates
- Shader input/output flow
- 2D transforms and animation foundations

This project is designed as a practical learning path toward understanding the graphics pipeline and rendering architecture.
