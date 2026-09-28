# Sckorpio Graphics — WebGL Fundamentals

This repository follows the updated curriculum roadmap defined in the project’s episode plan. The goal is to build a solid conceptual graphics foundation first, then implement those ideas through WebGL code.

## Curriculum roadmap

The updated series structure is the source of truth for the learning path:

- Chapter 01 — WebGL Basics
  - 1a. First Triangle
  - 1b. Vertex Data
  - 1c. Primitive Basics
  - 1d. WebGL Lesson Template
- Chapter 02 — Geometry
  - 2a. Multiple Triangles
  - 2b. Rectangle
  - 2c. Index Buffer
  - 2d. Letter F
- Chapter 03 — Primitive Topologies
  # Sckorpio Graphics: WebGL Fundamentals

  A step-by-step WebGL 2 learning repository. The implemented lessons progress from a deliberately unstructured first triangle to a reusable lesson template, indexed geometry, primitive topologies, dynamic vertex data, shader data flow, uniforms, multiple objects, pixel/world coordinates, a 2D camera, and 2D object transformations.

  ## Start Here

  The first three files have different purposes:

  1. [Chapter 1a](chapters/chapter01/chapter1a.js) is the raw first-triangle walkthrough. It keeps canvas setup, shader compilation, buffers, vertex arrays, and drawing together in a single `main()` so the WebGL pipeline is visible end to end.
  2. [Chapter 1b](chapters/chapter01/chapter1b.js) is a blank organizational scaffold. It names the intended sections for global state, shader strings, helper/setup functions, `main()`, and startup.
  3. [Chapter 1c](chapters/chapter01/chapter1c.js) is the completed triangle example organized using that scaffold. Its current source header still says “Chapter 1b”; the filename and its role in the learning sequence are authoritative here.

  Continue through the numbered directories in order. The complete source-grounded lesson index is in [Documentation/chapters_index.txt](Documentation/chapters_index.txt); repository setup and code-reading guidance are in [Documentation/README.md](Documentation/README.md).

  ## What Is Implemented

  The repository contains 50 numbered lesson files across Chapters 1–10, plus two extra experiments. Chapter 8 combines pixel-space conversion and the first grid/world examples; Chapter 9 develops the 2D camera; Chapter 10 develops translation, rotation, scale, model matrices, and multiple independently transformed objects. This file grouping is the current implementation structure, even where older curriculum notes used different chapter boundaries.

  The browser entry point currently loads `chapters/chapter09/chapter9f.js`, the continuous keyboard camera-control lesson. Change the module path in [index.html](index.html) to run a different lesson. Each lesson is a standalone ES module and expects the page's canvas with id `c`.

  ## Run A Lesson

  Serve the repository over HTTP from its root, then open `http://localhost:8000`:

  ```sh
  python3 -m http.server 8000
  ```

  Using a local server is appropriate because the page loads lesson code as an ES module. Lessons that use the GUI or matrix helpers also load lil-gui and gl-matrix from CDNs in `index.html`, so those lessons need network access. A browser with WebGL 2 support is required.

  ## Code Organization

  The structured lessons generally place module-scope `canvas` and `gl` bindings and lesson state first, followed by shader sources, shader/helper/camera/scene/GUI/input functions, `main()`, and the DOM-ready startup/export. Chapter 1a is intentionally the raw exception; Chapter 1b is the empty template; Chapter 1c demonstrates the template with a rendered triangle.

  ## Documentation

  - [Documentation/README.md](Documentation/README.md): repository guide, lesson architecture, run instructions, and scope.
  - [Documentation/chapters_index.txt](Documentation/chapters_index.txt): detailed index of every implemented lesson and extra.
  - [Documentation/series_episodes.txt](Documentation/series_episodes.txt): implemented episode sequence and the planned continuation beyond the current source files.

  The source is the authority for what currently runs. Some lesson block comments retain older or incorrect subchapter numbers; the documentation identifies files by their actual paths and records the known mismatches rather than silently renumbering code.
  - 10b. Camera Position

  - 10c. Camera Movement
