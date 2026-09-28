# WebGL Fundamentals: Repository Guide

## Purpose and Current Scope

This repository teaches the WebGL 2 rendering pipeline through small, standalone JavaScript lessons. The implemented files cover Chapters 1–10: the first triangle and lesson template, geometry, primitive topology, dynamic buffers, vertex and uniform shader data, multiple drawables, pixel/world coordinates, 2D camera controls, and 2D transformations. There are 50 numbered lesson files and two supplementary experiments.

The original broad curriculum extends into textures, sprites, 3D, lighting, and a complete rendering pipeline. Those subjects are planned, not implemented in this workspace yet. The maintained continuation is recorded in `series_episodes.txt`.

## Chapter 1: How to Read the Start

Chapter 1 is an intentional three-step onboarding sequence:

- `chapters/chapter01/chapter1a.js` is the raw, first-triangle implementation. It exposes canvas lookup, WebGL context creation, shader compilation/linking, vertex-buffer data, vertex-array configuration, viewport/clear state, and `drawArrays()` in one flow. It is the baseline to understand before adding structure.
- `chapters/chapter01/chapter1b.js` is a blank code-organization template. Its section labels reserve places for global data, shader sources, utility and setup functions, `main()`, and startup/export code. It is a scaffold, not a rendered lesson.
- `chapters/chapter01/chapter1c.js` is the finished basic-triangle lesson arranged around the template. It separates canvas/context and scene/shader state, shader strings, shader creation, resize helper, triangle setup, main/render work, and startup. Its comment header still calls it Chapter 1b; use the filename and this index as the identifier.

The progression is therefore raw implementation → empty organizational shape → completed example using that shape. It is not three separate graphics concepts.

## Implemented Learning Progression

1. **WebGL basics and geometry (Chapters 1–2):** compile and link shaders, describe vertices, draw triangles, build a rectangle, then compare duplicated vertex data with indexed reuse.
2. **Primitive assembly and dynamic data (Chapters 3–4):** compare point, line, loop, triangle, strip, and fan topologies; update vertex data through basic GUI controls to make editable shapes and polygons.
3. **Shader data (Chapters 5–6):** pass per-vertex colors through separate or interleaved attributes and vary color/brightness through uniforms; combine interpolated and uniform color inputs.
4. **Draw calls and coordinates (Chapters 7–8):** render independent objects with shared or distinct shader programs, then move from clip-space coordinates to pixel-space projection and a simple large grid/world.
5. **Camera and transforms (Chapters 9–10):** model camera position and zoom, form a view matrix, add keyboard movement, then apply translation, rotation, scale, composed model matrices, and independent transforms to multiple objects.

For the exact learning objective of each file, see `chapters_index.txt`.

## Source Layout

- `index.html` loads shared CSS, lil-gui, gl-matrix, and one selected chapter module.
- `chapters/chapter01/` through `chapters/chapter10/` contain the numbered lessons.
- `chapters/chapterExtra/` contains two supplemental experiments, not additional numbered chapters.
- `css/style.css` provides the shared canvas/page styling.
- `screenshots/` contains visual captures for a subset of early lessons (currently through the Chapter 6 series); it is not a complete screenshot set.
- `Documentation/` contains this guide, the detailed chapter index, and the episode roadmap.

## Lesson Architecture

Chapter 1a is deliberately written as a direct walkthrough. From 1c onward, the structured lessons generally use the following shape, with sections included only when the lesson needs them:

1. Module-scope `canvas` and `gl` bindings, scene objects, camera/control state, and shader metadata.
2. Vertex and fragment shader source strings.
3. Shader compilation/linking, resizing, matrix, scene-object, GUI, and input helpers.
4. `main()`: find `#c`, request `webgl2`, initialize lesson resources, and define/run the render work.
5. DOM-ready startup and the module export.

The top-level `let canvas` and `let gl` bindings are module-scoped bindings used by each lesson's functions; they are not properties on `window`. Each lesson is its own ES module and is intended to run independently. The order and labels are a learning aid rather than a shared runtime framework.

## Run and Select Lessons

From the repository root, start a local static HTTP server:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. `index.html` currently selects `chapters/chapter09/chapter9f.js`. To run another lesson, change the `src` of the `type="module"` script in `index.html` to that file's path. The page provides `<canvas id="c">`, loads lil-gui from jsDelivr and gl-matrix from cdnjs, and requires network access for those libraries. A WebGL 2-capable browser is required.

Do not load multiple lesson scripts into one page together: many lessons intentionally reuse top-level identifiers such as `canvas`, `gl`, `shader`, and `main`.

## Identifier and Header Notes

The filenames under `chapters/` are the stable lesson IDs. Some older block comments do not agree with their filenames or actual behavior. Known examples include `chapter1c.js` retaining the 1b template header; Chapter 5d/e headers using 5e/5f; Chapter 8b/c/d/e headers advancing ahead of their filenames; Chapter 9f repeating the 9e header; and Chapter 10e/f headers lagging their filenames. This guide does not rename source files or rewrite those headers. The detailed index describes the implementation found in each path.

## Conceptual and Coding Series

The intended pairing is:

- **CG Fundamentals:** visual explanations of graphics concepts without direct WebGL API implementation.
- **WebGL Fundamentals:** hands-on implementation of the same concepts.

Create reusable concept diagrams or animations once and adapt them for both series. Keep the conceptual episode plan distinct from claims about what source files exist today.
