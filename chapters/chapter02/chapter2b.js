/* #############################################################
CHAPTER 2b: Creating a Basic Triangle — Clean Structure
— Clean Structure
- Template for this series
###############################################################
*/

// =============================================================
// GLOBAL OBJECTS
// =============================================================
// =============================================================
// Scene Objects
// =============================================================
const triangle = {
    shader: null,

    vao: null,
    vbo: null,

    drawMode: null,
    drawOffset: 0,
    drawCount: 0
};

// =============================================================
// Shader Objects
// =============================================================
const shaderInfo = {
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

// Compile Shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if(compileStatus) return shader;

    console.error("Shader Compilation Error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// Link Program
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
    // Compile shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, shader.vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shader.fragmentShaderSource);
    // Create shader program
    shader.program = createProgram(gl, vertexShader, fragmentShader);
    // Get attribute locations
    shader.attributes.position = gl.getAttribLocation(shader.program,"a_position");
    // Get uniform locations
    // Future uniforms will be stored here.
}

// =============================================================
// Helper Functions
// =============================================================

// Resize Canvas
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
function setupTriangle(gl, shader) {
    // Connect shader to object
    triangle.shader = shader;

    //         v2
    //         /\
    //        /  \
    //       /    \
    //      /      \
    //     /        \
    //    v0--------v1

    // Vertex data on CPU
    const positions = new Float32Array([
        -0.5, 0.0, // v0
         0.0, 0.5, // v1
         0.5, 0.0  // v2
    ]);

    // Vertex Buffer
    triangle.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vbo);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
    );

    // Vertex Array
    triangle.vao = gl.createVertexArray();
    gl.bindVertexArray(triangle.vao);

    // Enable position attribute
    gl.enableVertexAttribArray(
        triangle.shader.attributes.position
    );

    // Bind Vertex Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vbo);

    // Vertex data format
    gl.vertexAttribPointer(
        triangle.shader.attributes.position,
        2,          // size: 2 components (X, Y)
        gl.FLOAT,   // type: 32-bit float
        false,      // normalize
        0,          // stride: tightly packed
        0           // offset: start of buffer
    );

    // Draw data
    triangle.drawMode = gl.TRIANGLES;
    triangle.drawOffset = 0;
    triangle.drawCount = 3;
}

// =============================================================
// RENDER
// =============================================================
function render(gl) {
    // CANVAS
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(
        0,
        0,
        gl.canvas.width,
        gl.canvas.height
    );

    // BACKGROUND
    gl.clearColor(0.32, 0.63, 0.67, 1.0); // Sckorpio Cyan
    gl.clear(gl.COLOR_BUFFER_BIT);

    // SHADER
    gl.useProgram(triangle.shader.program);

    // OBJECT
    gl.bindVertexArray(triangle.vao);

    // DRAW CALL
    gl.drawArrays(
        triangle.drawMode,
        triangle.drawOffset,
        triangle.drawCount
    );
}

// =============================================================
// MAIN
// =============================================================
function main() {
    // ---------------------------------------------------------
    // 1. WEBGL CANVAS
    // ---------------------------------------------------------
    const canvas = document.querySelector("#c");

    if(!canvas) {
        console.error("Canvas element not found");
        return;
    }

    const gl = canvas.getContext("webgl2");

    if(!gl) {
        console.error("WebGL2 is not supported by this browser");
        return;
    }

    // ---------------------------------------------------------
    // 2. SETUP
    // ---------------------------------------------------------
    setupShader(gl, shaderInfo);
    setupTriangle(gl, shaderInfo);

    // ---------------------------------------------------------
    // 3. RENDER
    // ---------------------------------------------------------


    // First render
    render(gl);

    // Render again when window is resized
    window.addEventListener("resize", () => render(gl));
}

// =============================================================
// STARTUP AND EXPORTS
// =============================================================

window.addEventListener("DOMContentLoaded", main);

export {
    main
};
