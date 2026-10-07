# Sckorpio Graphics: WebGL Fundamentals

A hands-on WebGL 2 curriculum progressing from the first draw to a complete
interactive 2D world and the Sckorpio game. The planned series runs through
Chapter 30; implementation is in progress, and some source folders retain
earlier chapter numbering.

The lesson codebase is now using a consistent template across Chapters 1–16:

- shader objects own shader source, program creation, and location lookup
- camera objects own resolution, transform state, and matrix updates
- scene objects own their CPU geometry and draw behavior
- each chapter keeps data + behavior together instead of scattering logic into
  unrelated global helpers

This pattern is introduced in `chapters/chapter02/chapter2a.js` and is the
baseline for the remaining lessons in the 2D fundamentals track.

See the [series overview](documentation/series_index.txt) and
[episode plan](documentation/series_episodes.txt).

To run a lesson, serve this folder over HTTP:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The page currently loads
`chapters/chapter01/chapter1a.js`; change the module path in `index.html` to
select another lesson.
