/* #############################################################
CHAPTER 3h: Learning Topology — TRIANGLE_FAN

Topics:
- Making a Filled Polygon — Hexagon
###############################################################
*/

// =============================================================
// GLOBAL OBJECTS
// =============================================================
let canvas = null;
let gl = null;

// =============================================================
// Scene Objects
// =============================================================

const hexagon = {
    shader: null,

    vao: null,
    vbo: null,
    ibo: null,

    drawMode: null,
    drawOffset: 0,
    drawCount: 0,
    drawType: null
};

// =============================================================
// Shader Objects
// =============================================================

const shader = {
    vertexShaderSource: `#version 300 es
    in vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`,
    fragmentShaderSource: `#version 300 es
    precision mediump float;
    out vec4 out_Color;

    void main() {
        // out_Color = vec4(0.0, 1.0, 1.0, 1.0); // Cyan
        out_Color = vec4(0.39, 0.33, 0.58, 1.0); // Sckorpio Purple
    }
`,
    program: null,

    attributes: {
        position: null
    },

    uniforms: {}
};

// =============================================================
// FUNCTIONS
// =============================================================

// =============================================================
// Shader Creating Functions
// =============================================================

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(compileStatus) return shader;

    console.error("Shader Compilation Error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(linkStatus) return program;

    console.error("Program Linking Error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function setupShader(gl, shader) {
    // Shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, shader.vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shader.fragmentShaderSource);
    // Program
    shader.program = createProgram(gl, vertexShader, fragmentShader);
    // Attributes
    shader.attributes.position = gl.getAttribLocation(shader.program, "a_position");
    // Future uniforms
}

// =============================================================
// Helper Functions
// =============================================================

function resizeCanvasToDisplaySize(canvas, multiplier = 1) {
    const width = (canvas.clientWidth * multiplier) | 0;
    const height = (canvas.clientHeight * multiplier) | 0;

    if(canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }

    return false;
}

// =============================================================
// Scene Objects Creation Functions
// =============================================================

function setupHexagon(gl, shader) {
    hexagon.shader = shader;

    /*
             v6---v5
           /   \ /   \
         v1     v0    v4
           \         /
             v2---v3
    */

    // ---------------------------------------------------------
    // VERTEX BUFFER
    // ---------------------------------------------------------

    const positions = new Float32Array([
         0.0,  0.0,   // v0 - Center
        -0.6,  0.0,   // v1
        -0.3, -0.6,   // v2
         0.3, -0.6,   // v3
         0.6,  0.0,   // v4
         0.3,  0.6,   // v5
        -0.3,  0.6    // v6
    ]);

    hexagon.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagon.vbo);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
    );

    // ---------------------------------------------------------
    // INDEX BUFFER
    // ---------------------------------------------------------

    const indices = new Uint16Array([
        0, 1, 2, 3, 4, 5, 6, 1
    ]);

    hexagon.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, hexagon.ibo);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        indices,
        gl.STATIC_DRAW
    );

    // ---------------------------------------------------------
    // VERTEX ARRAY
    // ---------------------------------------------------------

    hexagon.vao = gl.createVertexArray();
    gl.bindVertexArray(hexagon.vao);

    gl.enableVertexAttribArray(hexagon.shader.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagon.vbo);

    gl.vertexAttribPointer(
        hexagon.shader.attributes.position,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    // Index buffer binding is stored inside the VAO.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, hexagon.ibo);

    // Draw data
    hexagon.drawMode = gl.TRIANGLE_FAN;
    hexagon.drawOffset = 0;
    hexagon.drawCount = indices.length;
    hexagon.drawType = gl.UNSIGNED_SHORT;
}

// =============================================================
// MAIN
// =============================================================

function main() {
    // WEBGL CANVAS
    canvas = document.querySelector("#c");
    if(!canvas) {
        console.error("Canvas element not found");
        return;
    }

    gl = canvas.getContext("webgl2");
    if(!gl) {
        console.error("WebGL2 is not supported by this browser");
        return;
    }

    // SETUP
    setupShader(gl, shader);
    setupHexagon(gl, shader);

    // RENDER
    function render() {
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.32, 0.63, 0.67, 1.0); // Sckorpio Cyan
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(hexagon.shader.program);
        gl.bindVertexArray(hexagon.vao);

        gl.drawElements(
            hexagon.drawMode,
            hexagon.drawCount,
            hexagon.drawType,
            hexagon.drawOffset
        );
    }

    render();
    window.addEventListener("resize", render);
}

// =============================================================
// STARTUP AND EXPORTS
// =============================================================

window.addEventListener("DOMContentLoaded", main);

export {
    main
};
