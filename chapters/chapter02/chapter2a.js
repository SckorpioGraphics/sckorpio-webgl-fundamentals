// =============================================================
// WEBGL FUNDAMENTALS — CHAPTER LESSON TEMPLATE
// =============================================================
//
// PURPOSE
// -------------------------------------------------------------
// This is the common code structure used throughout the
// WebGL Fundamentals series.
//
// The goal is to keep every lesson:
//   - Easy to read
//   - Easy to extend
//   - Consistent across chapters
//   - Gradually closer to real engine architecture
//
// CORE PRINCIPLE
// -------------------------------------------------------------
// An object should own both:
//
//   1. Its DATA
//   2. The FUNCTIONS that manage that data
//
// In other words:
//
//   OBJECT = STATE + BEHAVIOR
//
// Example:
//
//   camera
//      ├── width
//      ├── height
//      ├── position
//      ├── viewMatrix
//      ├── projectionMatrix
//      │
//      ├── init()
//      ├── updateBounds()
//      ├── updateViewMatrix()
//      └── updateProjectionMatrix()
//
// This keeps related code together and makes the architecture
// easier to understand as the series becomes more advanced.
//
// =============================================================


// =============================================================
// GLOBAL OBJECTS
// =============================================================
//
// Keep the main objects of the lesson here.
//
// Each object should contain its own:
//
//   - Data / State
//   - GPU resources
//   - Initialization functions
//   - Update functions
//   - Rendering functions, when appropriate
//
// Do NOT create a large collection of global functions that
// manipulate unrelated object data.
//
// -------------------------------------------------------------
//
// CANVAS / WEBGL
// -------------------------------------------------------------
//
// Keep canvas and WebGL context here when needed.
//
// Example:
//
//   const canvas = document.querySelector("#c");
//   const gl = canvas.getContext("webgl2");
//
//
// -------------------------------------------------------------
//
// SHADER OBJECTS
// -------------------------------------------------------------
//
// A shader object owns everything specific to that shader:
//
//   - Vertex shader source
//   - Fragment shader source
//   - Program
//   - Attribute locations
//   - Uniform locations
//   - Shader initialization
//
// Example:
//
//   const shader = {
//
//       vertexShaderSource: `...`,
//       fragmentShaderSource: `...`,
//
//       program: null,
//
//       attributes: {
//           position: null
//       },
//
//       uniforms: {
//           color: null
//       },
//
//       init(gl) {
//           // Create shader program
//           // Find attributes
//           // Find uniforms
//       }
//   };
//
// Different shaders may have different attributes and uniforms.
// Therefore, shader-specific initialization belongs inside the
// shader object itself.
//
//
// -------------------------------------------------------------
//
// CAMERA OBJECTS
// -------------------------------------------------------------
//
// A camera owns camera state and camera-related matrices.
//
// Example:
//
//   const camera = {
//
//       // Camera data
//       width: 0,
//       height: 0,
//       position: [0, 0],
//
//       // Camera matrices
//       viewMatrix: mat3.create(),
//       projectionMatrix: mat3.create(),
//
//       // Camera functions
//       init() {},
//       updateBounds() {},
//       updateViewMatrix() {},
//       updateProjectionMatrix() {}
//   };
//
// Keep camera-related state and operations together.
//
//
//
// -------------------------------------------------------------
//
// SCENE / DRAWABLE OBJECTS
// -------------------------------------------------------------
//
// Objects such as:
//
//   - Rectangle
//   - Grid
//   - Triangle
//   - Mesh
//   - Axis
//
// should own the data and GPU resources required to render them.
//
// Example:
//
//   const rectangle = {
//
//       vao: null,
//       vbo: null,
//
//       drawMode: null,
//       drawOffset: 0,
//       drawCount: 0,
//
//       init(gl, shader) {
//           // Create vertex data
//           // Create VBO
//           // Create VAO
//           // Configure attributes
//       },
//
//       draw(gl) {
//           // Bind VAO
//           // Draw
//       }
//   };
//
// The object should know how to initialize and render itself.
//
//
//
// -------------------------------------------------------------
//
// OTHER STATE
// -------------------------------------------------------------
//
// Keep lesson-specific state here only when it does not naturally
// belong to an existing object.
//
// Examples:
//
//   - GUI state
//   - Animation state
//   - Temporary application state
//
// Prefer placing state inside the object that owns it whenever
// there is a clear ownership relationship.
//
// =============================================================


// =============================================================
// SHARED / GENERIC FUNCTIONS
// =============================================================
//
// Keep a function outside an object when it is genuinely generic
// infrastructure and does not belong to one particular object.
//
// Examples:
//
//   - resizeCanvasToDisplaySize()
//   - Generic WebGL resource helpers
//   - Utility functions
//
// Avoid creating generic functions simply to keep code outside
// an object.
//
// If a function primarily modifies one object's state,
// it should usually live inside that object instead.
//
//
// Example:
//
//   GOOD:
//
//       camera.updateViewMatrix();
//
//   Instead of:
//
//       updateViewMatrix(camera);
//
//
//
// -------------------------------------------------------------
//
// GENERIC WEBGL HELPERS
// -------------------------------------------------------------
//
// Functions that are reusable infrastructure may live here.
//
// Example:
//
//   createShader()
//   createProgram()
//   resizeCanvasToDisplaySize()
//
// These functions do not represent behavior belonging to one
// specific scene object.
//
// =============================================================


// =============================================================
// RENDER
// =============================================================
//
// render() should primarily orchestrate the frame.
//
// It should NOT contain the implementation details of every
// object.
//
// Think of render() as:
//
//   "Tell the systems what to do."
//
// rather than:
//
//   "Implement everything here."
//
// Example:
//
//   function render(gl) {
//
//       camera.updateBounds(gl);
//       camera.updateProjectionMatrix();
//       camera.updateViewMatrix();
//
//       rectangle.draw(gl);
//       grid.draw(gl);
//   }
//
// As the series becomes more advanced, render() should gradually
// become cleaner because more behavior is encapsulated inside
// the objects themselves.
//
// =============================================================


// =============================================================
// MAIN
// =============================================================
//
// main() is responsible for application initialization.
//
// Typical responsibilities:
//
//   - Find canvas
//   - Create WebGL context
//   - Initialize objects
//   - Start rendering
//   - Register events
//
// Example:
//
//   function main() {
//
//       // Canvas / WebGL
//
//       // Initialize shader
//       shader.init(gl);
//
//       // Initialize camera
//       camera.init(gl);
//
//       // Initialize scene objects
//       rectangle.init(gl, shader);
//       grid.init(gl, shader);
//
//       // Start rendering
//       render(gl);
//
//       // Events
//   }
//
// Keep main() readable.
// It should describe WHAT is being initialized,
// not contain the implementation of HOW it is initialized.
//
// =============================================================


// =============================================================
// STARTUP AND EXPORTS
// =============================================================
//
// Application startup and module exports.
//
// Example:
//
//   window.addEventListener("DOMContentLoaded", main);
//
//   export {
//       main
//   };
//
// =============================================================


// =============================================================
// ARCHITECTURE EVOLUTION
// =============================================================
//
// The architecture should grow naturally with the series.
//
// Early chapters:
//
//   Object
//      ├── data
//      └── init()
//
//
// As concepts are introduced:
//
//   Camera
//      ├── data
//      ├── init()
//      ├── updateBounds()
//      ├── updateProjectionMatrix()
//      └── updateViewMatrix()
//
//
// Drawable objects:
//
//   Rectangle
//      ├── GPU resources
//      ├── init()
//      └── draw()
//
//
// Later, the same structure can naturally evolve toward:
//
//   Renderer
//   Camera
//   Shader
//   Mesh
//   Material
//   Scene
//
// The architecture should NEVER be introduced just for the sake
// of abstraction.
//
// Introduce a new structure when the concept becomes necessary
// for the lesson.
//
// =============================================================


// =============================================================
// GOLDEN RULE
// =============================================================
//
// Keep related DATA + BEHAVIOR together.
//
// If an object owns the data,
// it should usually own the functions that manage that data.
//
// This keeps every chapter:
//
//   SIMPLE
//      ↓
//   CONSISTENT
//      ↓
//   EXTENSIBLE
//      ↓
//   ENGINE-LIKE
//
// =============================================================