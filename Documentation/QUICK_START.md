# WebGL Fundamentals: Quick Start

This repository contains 58 numbered WebGL 2 lesson files across Chapters 1–13, plus two supplemental experiments. Chapter 1b is a blank template; the other files are runnable lessons.

## Start with Chapter 1

- **1a:** Raw first triangle; follow the WebGL setup and draw call end to end.
- **1b:** Empty code-organization template.
- **1c:** Completed triangle organized with the template. Its source header still says 1b.

## Learning Path

1. Chapter 1: WebGL basics and lesson structure.
2. Chapter 2: Geometry and indexing.
3. Chapter 3: Primitive topologies.
4. Chapter 4: Dynamic buffers and editable geometry.
5. Chapter 5: Vertex data and color flow.
6. Chapter 6: Uniforms.
7. Chapter 7: Multiple objects and programs.
8. Chapter 8: Pixel space and first world geometry.
9. Chapter 9: 2D world and camera.
10. Chapter 10: 2D object transformations.
11. Chapter 11: 2D rotation.
12. Chapter 12: 2D scale.
13. Chapter 13: Model matrices.

## Lesson Structure

Chapter 1a is intentionally a raw first-triangle walkthrough. From Chapter 1c onward, numbered lessons keep shader sources with their shader metadata in `shaderInfo`, create `canvas` and `gl` locally in `main()`, and pass `gl` to the top-level `render(gl)` function and callbacks.

## Run

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The page currently runs `chapters/chapter13/chapter13d.js`. Change the module path in `index.html` to select another lesson. WebGL 2 and network access for the CDN libraries are required.

## More Detail

- [Chapter-by-chapter index](chapters_index.txt)
- [Series plan](series_episodes.txt)
- [Repository guide](README.md)
