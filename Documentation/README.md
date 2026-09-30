# WebGL Fundamentals: Repository Guide

## Purpose and Current Scope

This repository teaches the WebGL 2 rendering pipeline through small, standalone JavaScript lessons. It contains 58 numbered files across Chapters 1–13, plus two supplementary experiments. Topics progress from the first triangle through geometry, shader data, camera controls, and 2D transformations including rotation, scale, and model matrices.

The planned continuation covers textures, sprites, 3D, lighting, materials, and a complete rendering pipeline. Those later topics are not implemented yet; see `series_episodes.txt` for the roadmap.

## Chapter 1: How to Read the Start

Chapter 1 is an intentional three-step onboarding sequence:

- `chapters/chapter01/chapter1a.js` is the raw, first-triangle implementation. It exposes canvas lookup, WebGL context creation, shader compilation/linking, vertex-buffer data, vertex-array configuration, viewport/clear state, and `drawArrays()` in one flow. It is the baseline to understand before adding structure.
- `chapters/chapter01/chapter1b.js` is a blank code-organization template. Its section labels reserve places for global data, shader/camera/scene objects, helper categories, `main()`, and startup/export code. It is a scaffold, not a rendered lesson.
- `chapters/chapter01/chapter1c.js` is the finished basic-triangle lesson arranged around the template. It separates shader metadata/source, setup helpers, a top-level render function, `main()`, and startup. Its comment header still calls it Chapter 1b; use the filename and this index as the identifier.

The progression is therefore raw implementation → empty organizational shape → completed example using that shape. It is not three separate graphics concepts.

## Implemented Learning Progression

1. **WebGL basics and geometry (Chapters 1–2):** compile and link shaders, describe vertices, draw triangles, build a rectangle, then compare duplicated vertex data with indexed reuse.
2. **Primitive assembly and dynamic data (Chapters 3–4):** compare point, line, loop, triangle, strip, and fan topologies; update vertex data through basic GUI controls to make editable shapes and polygons.
3. **Shader data (Chapters 5–6):** pass per-vertex colors through separate or interleaved attributes and vary color/brightness through uniforms; combine interpolated and uniform color inputs.
4. **Draw calls and coordinates (Chapters 7–8):** render independent objects with shared or distinct shader programs, then move from clip-space coordinates to pixel-space projection and a simple large grid/world.
5. **Camera (Chapter 9):** model camera position and zoom, form a view matrix, and add discrete then continuous keyboard movement.
6. **2D transformations (Chapters 10–13):** apply translation, compare rotation calculations and matrix order, scale objects, and compose model/view/projection matrices for one or multiple objects.

For the exact learning objective of each file, see `chapters_index.txt`.

## Source Layout

- `index.html` loads shared CSS, lil-gui, gl-matrix, and one selected chapter module.
- `chapters/chapter01/` through `chapters/chapter13/` contain the numbered lessons.
- `chapters/chapterExtra/` contains two supplemental experiments, not additional numbered chapters.
- `css/style.css` provides the shared canvas/page styling.
- `screenshots/` contains visual captures for a subset of early lessons (currently through the Chapter 6 series); it is not a complete screenshot set.
- `Documentation/` contains this guide, the detailed chapter index, and the episode roadmap.

## Lesson Architecture

Chapter 1a is deliberately written as a direct walkthrough, and Chapter 1b is an organizational template. From Chapter 1c onward, the numbered lessons use a more structured pattern:

1. Shader metadata and GLSL source strings live together in a `shaderInfo` object. Chapter 7c has two named shader-info objects because it demonstrates two programs.
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

Open `http://localhost:8000`. `index.html` currently selects `chapters/chapter13/chapter13d.js`. To run another lesson, change the `src` of the `type="module"` script in `index.html` to that file's path. The page provides `<canvas id="c">`, loads lil-gui from jsDelivr and gl-matrix from cdnjs, and requires network access for those libraries. A WebGL 2-capable browser is required.

Do not load multiple lesson scripts into one page together: each initializes the same canvas independently, and several install persistent input handlers or animation loops. Module-scoped identifiers do not leak onto `window`, but the lessons still compete for the page's rendering surface and interaction state.

## Identifier and Header Notes

The filenames under `chapters/` are the stable lesson IDs. Some source headers are stale: examples include `chapter1c.js` retaining the 1b template header, Chapter 5d/e using 5e/5f, Chapter 8b–8e using 8c–8f, Chapter 9f repeating 9e, Chapter 10b–10d repeating 10a, Chapter 11c repeating 11b, and Chapter 13c/13d lagging by one subchapter. This guide does not rewrite those headers; the detailed index describes the implementation found at each path. There are no numbered Chapter 10e or 10f files.

## Conceptual and Coding Series

The intended pairing is:

- **CG Fundamentals:** visual explanations of graphics concepts without direct WebGL API implementation.
- **WebGL Fundamentals:** hands-on implementation of the same concepts.

Create reusable concept diagrams or animations once and adapt them for both series. Keep the conceptual episode plan distinct from claims about what source files exist today.
