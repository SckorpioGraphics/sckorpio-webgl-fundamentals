# WebGL Fundamentals: Quick Start

This repository contains 59 numbered WebGL 2 files across Chapters 0–14, plus two supplemental experiments. Chapter 2a is a blank template; the other files are lessons or the Chapter 0 introduction.

## Start Here

- **0:** Why this series, why WebGL, and what the lessons cover.
- **1a:** Raw first triangle; follow WebGL setup and the draw call end to end.
- **2a:** Blank code-organization template.
- **2b:** Completed triangle organized with the template.

## Learning Path

0. Chapter 0: Series introduction.
1. Chapter 1: Raw WebGL triangle.
2. Chapter 2: Lesson template and structured triangle.
3. Chapter 3: Geometry and indexing.
4. Chapter 4: Primitive topologies.
5. Chapter 5: Dynamic buffers and editable geometry.
6. Chapter 6: Vertex data and color flow.
7. Chapter 7: Uniforms.
8. Chapter 8: Multiple objects and programs.
9. Chapter 9: Pixel space and first world geometry.
10. Chapter 10: 2D world and camera.
11. Chapter 11: 2D translation.
12. Chapter 12: 2D rotation.
13. Chapter 13: 2D scale.
14. Chapter 14: Model matrices.

## Lesson Structure

Chapter 1a is intentionally a raw first-triangle walkthrough. Chapter 2a is a blank organizational template, and 2b demonstrates the structured pattern: shader sources live in `shaderInfo`, `canvas` and `gl` are local to `main()`, and `gl` is passed to top-level `render(gl)` and its callbacks.

## Run

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The page currently runs `chapters/chapter14/chapter14d.js`. Change the module path in `index.html` to select another lesson. WebGL 2 and network access for the CDN libraries are required.

## More Detail

- [Chapter-by-chapter index](chapters_index.txt)
- [Series plan](series_episodes.txt)
- [Repository guide](README.md)
