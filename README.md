# Sckorpio Graphics: WebGL Fundamentals

A hands-on WebGL 2 curriculum progressing from the first draw to a complete
interactive 2D world and the Sckorpio game. The planned series runs through
Chapter 30; implementation is in progress, and some source folders retain
earlier chapter numbering.

See the [series overview](Documentation/series_index.txt) and
[episode plan](Documentation/series_episodes.txt).

To run a lesson, serve this folder over HTTP:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The page currently loads
`chapters/chapter01/chapter1a.js`; change the module path in `index.html` to
select another lesson.
