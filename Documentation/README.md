# WebGL Fundamentals: Repository Guide

## Purpose and Current Scope

This repository teaches the WebGL 2 rendering pipeline through small, standalone JavaScript lessons. It contains 59 numbered files across Chapters 0–14, plus two supplementary experiments. Topics progress from a series introduction and first triangle through geometry, shader data, camera controls, and 2D transformations including translation, rotation, scale, and model matrices.

The planned continuation covers textures, sprites, 3D, lighting, materials, and a complete rendering pipeline. Those later topics are not implemented yet; see `series_episodes.txt` for the roadmap.

## Chapters 0–2: How to Read the Start

The opening sequence separates series orientation, a raw first draw, and the structured lesson pattern:

- `chapters/chapter00/chapter0.js` introduces the series, WebGL, and its learning goals.
- `chapters/chapter01/chapter1a.js` is the raw, first-triangle implementation. It exposes canvas lookup, WebGL context creation, shader compilation/linking, vertex-buffer data, vertex-array configuration, viewport/clear state, and `drawArrays()` in one flow.
- `chapters/chapter02/chapter2a.js` is a blank code-organization template, not a rendered lesson.
- `chapters/chapter02/chapter2b.js` is the completed basic triangle arranged around that template.

The progression is orientation → raw implementation → empty organizational shape → completed example using that shape.

## Implemented Learning Progression

1. **Introduction and first draw (Chapters 0–2):** orient the learner, inspect a raw triangle, then introduce the lesson template and a structured example.
2. **Geometry and assembly (Chapters 3–4):** build indexed shapes and compare point, line, and triangle topologies.
3. **Dynamic and shader data (Chapters 5–7):** edit geometry, pass vertex colors, and control rendering with uniforms.
4. **Objects and coordinates (Chapters 8–9):** render multiple objects, then progress from pixel space to world geometry.
5. **Camera (Chapter 10):** model camera position and zoom, form a view matrix, and add keyboard movement.
6. **2D transformations (Chapters 11–14):** apply translation, rotation, scale, and model/view/projection composition.

For the exact learning objective of each file, see `chapters_index.txt`.

## Source Layout

- `index.html` loads shared CSS, lil-gui, gl-matrix, and one selected chapter module.
- `chapters/chapter00/` through `chapters/chapter14/` contain the numbered lessons.
- `chapters/chapterExtra/` contains two supplemental experiments, not additional numbered chapters.
- `css/style.css` provides the shared canvas/page styling.
- `screenshots/` contains visual captures for a subset of lessons. Some screenshot filenames still follow the earlier chapter numbering; it is not a complete screenshot set.
- `Documentation/` contains this guide, the detailed chapter index, and the episode roadmap.

## Lesson Architecture

Chapter 1a is deliberately written as a direct walkthrough, and Chapter 2a is an organizational template. From Chapter 2b onward, the numbered lessons use a more structured pattern:

1. Shader metadata and GLSL source strings live together in a `shaderInfo` object. Chapter 8c has two named shader-info objects because it demonstrates two programs.
2. Scene objects, camera state, and controls are module-scoped lesson data; `canvas` and the WebGL 2 context `gl` are local to `main()`.
3. Setup helpers receive `gl` explicitly. Where a shared shader setup helper is used, the shader-info object is also passed as an argument.
4. `render(gl)` is a top-level function. GUI, resize, and animation callbacks wrap it to supply the context.
5. DOM-ready startup and the module export remain at the end of each lesson.

These lessons are separate ES modules, not a shared runtime framework. Do not load several lesson modules on the same page: each expects to initialize the same `#c` canvas and may install its own controls, event handlers, and render loop.

## Run and Select Lessons

From the repository root, start a local static HTTP server:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. `index.html` currently selects `chapters/chapter14/chapter14d.js`. To run another lesson, change the `src` of the `type="module"` script in `index.html` to that file's path. The page provides `<canvas id="c">`, loads lil-gui from jsDelivr and gl-matrix from cdnjs, and requires network access for those libraries. A WebGL 2-capable browser is required.

Do not load multiple lesson scripts into one page together: each initializes the same canvas independently, and several install persistent input handlers or animation loops. Module-scoped identifiers do not leak onto `window`, but the lessons still compete for the page's rendering surface and interaction state.

## Identifier and Header Notes

The filenames under `chapters/` are the stable lesson IDs. Chapter comment titles use the renumbered chapter and subchapter IDs. Supplemental files remain under `chapters/chapterExtra/` and are not part of the numbered sequence.

## Conceptual and Coding Series

The intended pairing is:

- **CG Fundamentals:** visual explanations of graphics concepts without direct WebGL API implementation.
- **WebGL Fundamentals:** hands-on implementation of the same concepts.

Create reusable concept diagrams or animations once and adapt them for both series. Keep the conceptual episode plan distinct from claims about what source files exist today.
