# WebGL Fundamentals: Quick Start

This repo contains 50 WebGL 2 lessons across Chapters 1–10 and two extra experiments.

## Start with Chapter 1

- **1a:** Raw first triangle; follow the WebGL setup and draw call end to end.
- **1b:** Empty code-organization template.
- **1c:** Completed triangle organized with the template. Its source header still says 1b.

## Learning Path

1. Chapters 1–2: WebGL basics, geometry, and index buffers.
2. Chapters 3–4: Primitive topologies and editable geometry.
3. Chapters 5–6: Vertex attributes, colors, and uniforms.
4. Chapters 7–8: Multiple objects, pixel coordinates, and world geometry.
5. Chapters 9–10: 2D camera controls and object transformations.

## Run

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The page currently runs `chapters/chapter09/chapter9f.js`. Change the module path in `index.html` to select another lesson. WebGL 2 and network access for the CDN libraries are required.

## More Detail

- [Chapter-by-chapter index](chapters_index.txt)
- [Series plan](series_episodes.txt)
- [Repository guide](README.md)
