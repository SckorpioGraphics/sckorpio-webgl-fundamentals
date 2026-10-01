/* #############################################################
CHAPTER 9d: Multiple Objects

Topics:
- Rendering multiple objects
- A Grid and a Triangle
- Separate VAO/VBO for each object
- Using GL_LINES for the grid
- Using GL_TRIANGLES for the triangle
- Multiple draw calls
- Clip space coordinates [-1, +1]
###############################################################
*/

// =============================================================
// GLOBAL OBJECTS
// =============================================================

// =============================================================
// Scene Objects
// =============================================================

const grid = {
    shader: null,
    vao: null,
    vbo: null,
    drawMode: null,
    drawOffset: 0,
    drawCount: 0
};

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

/*
    No UI in this chapter yet.
    The focus here is on rendering multiple
    independent objects in clip space.
*/

const shaderInfo = {
    vertexShaderSource: `#version 300 es
    in vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`,
    fragmentShaderSource: `#version 300 es
    precision mediump float;

    uniform vec3 u_color;

    out vec4 out_color;

    void main() {
        out_color = vec4(u_color, 1.0);
    }
`,
    program: null,
    attributes: {
        position: null
    },
    uniforms: {
        color: null
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
    const vertexShader = createShader(gl,gl.VERTEX_SHADER,shader.vertexShaderSource);
    const fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,shader.fragmentShaderSource);
    shader.program = createProgram(gl,vertexShader,fragmentShader);
    shader.attributes.position = gl.getAttribLocation(shader.program, "a_position");
    shader.uniforms.color = gl.getUniformLocation(shader.program, "u_color");
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

function setupGrid(gl, shader) {
    grid.shader = shader;

    const positions = new Float32Array([
        // Vertical lines
        -0.8, -1.0,  -0.8, 1.0,
        -0.6, -1.0,  -0.6, 1.0,
        -0.4, -1.0,  -0.4, 1.0,
        -0.2, -1.0,  -0.2, 1.0,
         0.0, -1.0,   0.0, 1.0,
         0.2, -1.0,   0.2, 1.0,
         0.4, -1.0,   0.4, 1.0,
         0.6, -1.0,   0.6, 1.0,
         0.8, -1.0,   0.8, 1.0,

        // Horizontal lines
        -1.0, -0.8,   1.0, -0.8,
        -1.0, -0.6,   1.0, -0.6,
        -1.0, -0.4,   1.0, -0.4,
        -1.0, -0.2,   1.0, -0.2,
        -1.0,  0.0,   1.0,  0.0,
        -1.0,  0.2,   1.0,  0.2,
        -1.0,  0.4,   1.0,  0.4,
        -1.0,  0.6,   1.0,  0.6,
        -1.0,  0.8,   1.0,  0.8
    ]);

    grid.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grid.vbo);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
    );

    grid.vao = gl.createVertexArray();
    gl.bindVertexArray(grid.vao);

    gl.enableVertexAttribArray(grid.shader.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, grid.vbo);

    gl.vertexAttribPointer(
        grid.shader.attributes.position,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    grid.drawMode = gl.LINES;
    grid.drawOffset = 0;
    grid.drawCount = positions.length / 2;
}

function setupTriangle(gl, shader) {
    triangle.shader = shader;

    const positions = new Float32Array([
        -0.4, -0.3,
         0.0,  0.5,
         0.4, -0.3
    ]);

    triangle.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vbo);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
    );

    triangle.vao = gl.createVertexArray();
    gl.bindVertexArray(triangle.vao);

    gl.enableVertexAttribArray(
        triangle.shader.attributes.position
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vbo);

    gl.vertexAttribPointer(
        triangle.shader.attributes.position,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    triangle.drawMode = gl.TRIANGLES;
    triangle.drawOffset = 0;
    triangle.drawCount = 3;
}

// =============================================================
// RENDER
// =============================================================
function render(gl) {
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.32, 0.63, 0.67, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderInfo.program);

    // ---------------------------------------------------------
    // GRID
    // ---------------------------------------------------------

    gl.uniform3f(
        shaderInfo.uniforms.color,
        0.39, 0.33, 0.58
    );

    gl.bindVertexArray(grid.vao);

    gl.drawArrays(
        grid.drawMode,
        grid.drawOffset,
        grid.drawCount
    );

    // ---------------------------------------------------------
    // TRIANGLE
    // ---------------------------------------------------------

    gl.uniform3f(
        shaderInfo.uniforms.color,
        1.0, 1.0, 0.0   // Red
    );

    gl.bindVertexArray(triangle.vao);

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

    setupShader(gl, shaderInfo);
    setupGrid(gl, shaderInfo);
    setupTriangle(gl, shaderInfo);
    render(gl);
    window.addEventListener("resize", () => render(gl));
}

// =============================================================
// STARTUP AND EXPORTS
// =============================================================

window.addEventListener("DOMContentLoaded", main);

export {
    main
};
