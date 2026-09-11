# WebGL Fundamentals Index

This folder documents the learning progression inside the project. The repository is organized as a step-by-step walkthrough of WebGL 2 fundamentals, showing how geometry, shaders, buffers, uniforms, and transforms work together in a real graphics pipeline.

## Project structure

- Chapter 0: basic WebGL setup and starter reference code
- Chapter 1: foundational geometry and triangle-based drawing
- Chapter 2: primitive topologies such as points, lines, and triangles
- Chapter 3: dynamic buffers and interactive vertex updates
- Chapter 4: shader data flow with uniforms and varying values
- Chapter 5: render loops and 2D transformations
- Chapter 6: reserved for future advanced work

## Chapter overview

### Chapter 0
The starting point for the project. It contains the basic boilerplate used repeatedly across later examples, including the WebGL context, shader source creation, program linking, and a minimal render loop.

### Chapter 1
The first real graphics fundamentals chapter. This introduces the core of WebGL drawing:
- creating a canvas and WebGL context
- compiling shaders
- creating a shader program
- creating vertex buffers and VAOs
- drawing triangles and rectangles
- introducing indexed drawing with `drawElements()`

Example files:
- `chapter1a.js` - basic triangle
- `chapter1b.js` - multiple triangles
- `chapter1c.js` - rectangle made from triangles
- `chapter1d.js` - index buffer and `drawElements()`
- `chapter1e.js` - custom geometry built from triangles

### Chapter 2
This chapter focuses on primitive topology and how the same vertex data can be interpreted in different ways.

Topics include:
- `POINTS`
- `LINES`
- `LINE_LOOP`
- `TRIANGLES`
- `TRIANGLE_STRIP`
- `TRIANGLE_FAN`

The examples here teach how drawing mode changes the final visual output without changing the underlying data.

### Chapter 3
This chapter moves into dynamic drawing and interactivity. It explores how a buffer can be updated at runtime to change the mesh or vertex positions over time.

Common ideas in this section:
- dynamic vertex updates
- UI-driven manipulation
- responding to live input
- modifying geometry in real time

### Chapter 4
This section is about shader input and GPU data flow.

It covers:
- uniforms for shared global values
- vertex attributes for per-vertex data
- varying values for interpolating data across the pipeline
- mixing vertex colors and uniform colors
- separate and combined buffer patterns

This is where the project starts to feel like a real rendering pipeline rather than just static drawing.

### Chapter 5
This chapter introduces animation and transformation logic. It moves beyond simple geometry and starts to treat the scene as a set of objects that can be translated, rotated, and scaled.

Key topics:
- render loop and animation timing
- 2D transforms
- matrix multiplication
- model/view/projection-style thinking
- interaction with `lil-gui`

### Chapter 6
The folder is intentionally left as a placeholder for the next phase of the project. It is reserved for future GPU or renderer topics beyond the current foundation.

## Overall learning path

The repository is structured to teach the following progression:

1. Setup a WebGL canvas and shaders
2. Build geometry from vertices and indices
3. Draw using different primitive topologies
4. Update data dynamically
5. Pass data into shaders via attributes, uniforms, and varying values
6. Apply transforms and build animated scenes
7. Work toward renderer and engine-style architecture

## Purpose

This project serves as a practical learning series for understanding how real-time graphics systems are built from the ground up, using WebGL as the foundation and shader-based rendering as the core workflow.
