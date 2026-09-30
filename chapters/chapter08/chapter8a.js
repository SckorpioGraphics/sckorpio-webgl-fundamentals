/* #############################################################
CHAPTER 8a: 2D Space

Topics:
- Creating a basic rectangle
- Vertex data in pixel space
- Uniforms for screen-space data
- Pixel space to clip space conversion
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

const rectangle = {
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

/*
    No UI in this chapter yet.
    The focus here is on pixel-space coordinates
    and their conversion to clip space.
*/

const shader = {
    vertexShaderSource: `#version 300 es
    in vec2 a_position;

    uniform vec2 u_resolution;

    void main() {
        // Pixel space to [0, 1]
        vec2 zeroToOne = a_position / u_resolution;

        // [0, 1] to [0, 2]
        vec2 zeroToTwo = zeroToOne * 2.0;

        // [0, 2] to [-1, 1]
        vec2 clipPostion = zeroToTwo - 1.0;

        gl_Position = vec4(clipPostion, 0.0, 1.0);
    }
`,
    fragmentShaderSource: `#version 300 es
    precision mediump float;

    out vec4 out_color;

    void main() {
        out_color = vec4(0.39, 0.33, 0.58, 1.0); // Sckorpio Purple
    }
`,
    program: null,
    attributes: {
        position: null
    },
    uniforms: {
        resolution: null
    }
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
    // uniforms
    shader.uniforms.resolution = gl.getUniformLocation(shader.program, "u_resolution");
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

function setupRectangle(gl, shader) {
    rectangle.shader = shader;

    const positions = new Float32Array([
        20, 20,       // Left Bottom
        200, 20,      // Right Bottom
        20, 100,      // Left Top

        20, 100,      // Left Top
        200, 20,      // Right Bottom
        200, 100      // Right Top
    ]);

    rectangle.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
    );

    rectangle.vao = gl.createVertexArray();
    gl.bindVertexArray(rectangle.vao);

    gl.enableVertexAttribArray(
        rectangle.shader.attributes.position
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);

    gl.vertexAttribPointer(
        rectangle.shader.attributes.position,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    rectangle.drawMode = gl.TRIANGLES;
    rectangle.drawOffset = 0;
    rectangle.drawCount = 6;
}

// =============================================================
// MAIN
// =============================================================

function main() {
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

    setupShader(gl, shader);
    setupRectangle(gl, shader);

    function render() {
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.32, 0.63, 0.67, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(rectangle.shader.program);

        // Pass canvas resolution to shader
        gl.uniform2f(
            rectangle.shader.uniforms.resolution,
            gl.canvas.width,
            gl.canvas.height
        );

        gl.bindVertexArray(rectangle.vao);

        gl.drawArrays(
            rectangle.drawMode,
            rectangle.drawOffset,
            rectangle.drawCount
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
