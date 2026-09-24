# WebGL Fundamentals Index

This documentation reflects the updated roadmap in the curriculum file and the actual code currently present in the workspace.

## Repository overview

The project is structured around a full WebGL curriculum that starts with the basics and extends through 3D, textures, lighting, and the complete rendering pipeline. The code currently present in the repo is a working subset of that wider roadmap.

## Updated series roadmap

### Chapter 01 — WebGL Basics
- 1a. First Triangle
- 1b. Vertex Data
- 1c. Primitive Basics
- 1d. WebGL Lesson Template

### Chapter 02 — Geometry
- 2a. Multiple Triangles
- 2b. Rectangle
- 2c. Index Buffer
- 2d. Letter F

### Chapter 03 — Primitive Topologies
- 3a. POINTS
- 3b. LINES
- 3c. LINE_STRIP
- 3d. LINE_LOOP
- 3e. Hexagon Outline
- 3f. TRIANGLES
- 3g. TRIANGLE_STRIP
- 3h. TRIANGLE_FAN

### Chapter 04 — Dynamic Buffers
- 4a. Dynamic Triangle
- 4b. Dynamic Rectangle
- 4c. Dynamic Polygon / Circle Outline
- 4d. Dynamic Filled Polygon / Circle

### Chapter 05 — Shader Data Flow
- 5a. Varying / Vertex Color
- 5b. Multiple Buffers
- 5c. Interleaved Buffer
- 5d. Gradient Rectangle
- 5e. Two-Triangle Rectangle with Different Vertex Colors

### Chapter 06 — Uniforms
- 6a. Uniform Float / Intensity
- 6b. RGB Uniforms + Intensity
- 6c. vec3 Color Uniform
- 6d. Varying + Uniform Together
- 6e. Uniform Types and WebGL APIs

### Chapter 07 — Multiple Objects
- 7a. Same Topology / Same Shader — Triangle + Rectangle
- 7b. Different Topologies / Same Shader — Triangle + Hexagon
- 7c. Different Shaders — Uniform-Color Triangle + Vertex-Color Rectangle
- 7d. Grid + Triangle in Clip Space

### Chapter 08 — Pixel Space
- 8a. Basic Rectangle in Pixel Coordinates
- 8b. Position and Size
- 8c. Matrix Version — mat3 / Pixel → Clip / Inverted Y
- 8d. Random Rectangles / Reused VBO

### Chapter 09 — 2D World
- 9a. Building a 2D World
- 9b. Static World
- 9c. Multiple World Objects

### Chapter 10 — 2D Camera
- 10a. View Matrix
- 10b. Camera Position
- 10c. Camera Movement
- 10d. Keyboard Controls
- 10e. Exploring the World

### Chapter 11 — 2D Transformations
- 11a. Translation
- 11b. Rotation
- 11c. Scale
- 11d. Transformation Composition
- 11e. Model Matrix
- 11f. Animation

### Chapter 12 — 2D Textures
- 12a. Texture Creation
- 12b. Texture Upload
- 12c. UV Coordinates
- 12d. Texture Sampling
- 12e. Textured Rectangle
- 12f. Textured Transformations
- 12g. Multiple Textured Objects

### Chapter 13 — 2D Rendering / Scene
- 13a. Sprites
- 13b. Sprite Sheets
- 13c. UV Sub-Rectangles
- 13d. Sprite Animation
- 13e. Sprite Flipping
- 13f. Multiple Sprites
- 13g. Small 2D Scene

### Chapter 14 — 3D World
### Chapter 15 — 3D Camera
### Chapter 16 — 3D Projection
### Chapter 17 — 3D Transformations
### Chapter 18 — 3D Textures
### Chapter 19 — Lighting Fundamentals
### Chapter 20 — Materials & Multiple Lights
### Chapter 21 — Complete WebGL Pipeline

## Current repo status

The workspace currently contains the implemented lesson files for the early chapters and a live browser demo entry point. This is a subset of the full roadmap above.

### Active source files in the repo
- `index.html` — current browser launch page
- `chapters/chapter01/` through `chapters/chapter11/` — early implementation lessons
- `chapters/chapterExtra/chapterExtra1.js` — extra render-loop / projection study
- `Documentation/` — curriculum notes and chapter docs

## Learning flow

The overall progression is:

WebGL Basics → Geometry → Primitive Topologies → Dynamic Buffers → Shader Data Flow → Uniforms → Multiple Objects → Pixel Space → 2D World → 2D Camera → 2D Transformations → 2D Textures → 2D Rendering / Scene → 3D World → 3D Camera → 3D Projection → 3D Transformations → 3D Textures → Lighting → Materials + Multiple Lights → Complete WebGL Pipeline

## Concept-to-code relationship

The curriculum intentionally separates the conceptual side and the coding side:

- CG Fundamentals — conceptual graphics learning with no Direct WebGL code
- WebGL Fundamentals — practical shader and rendering implementation

The same visual resources and explanations can be reused across both series.
