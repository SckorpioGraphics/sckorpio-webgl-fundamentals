/* #############################################################
CHAPTER 7b: Multiple Objects

Topics:
- Rendering multiple objects
- A Triangle and a Line Loop
- Separate VAO/VBO for each object
- Different topologies
- Different shapes
- Different colors
- Multiple draw calls
- Using the same shader for multiple objects
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

const hexagon = {
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
    independent objects with different topologies.
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
    // Shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, shader.vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shader.fragmentShaderSource);
    // Program
    shader.program = createProgram(gl, vertexShader, fragmentShader);
    // Attributes
    shader.attributes.position = gl.getAttribLocation(shader.program, "a_position");
    // uniforms
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

function setupTriangle(gl, shader) {
    triangle.shader = shader;

    const positions = new Float32Array([
        -0.7, 0.0,
        -0.5, 0.5,
        -0.3, 0.0
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

    gl.enableVertexAttribArray(triangle.shader.attributes.position);
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

function setupHexagon(gl, shader) {
    hexagon.shader = shader;

    const positions = new Float32Array([
         0.6,  0.0,
         0.45, 0.26,
         0.15, 0.26,
         0.0,  0.0,
         0.15,-0.26,
         0.45,-0.26
    ]);

    hexagon.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagon.vbo);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
    );

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

    hexagon.drawMode = gl.LINE_LOOP;
    hexagon.drawOffset = 0;
    hexagon.drawCount = 6;
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
    // TRIANGLE
    // ---------------------------------------------------------

    gl.uniform3f(
        shaderInfo.uniforms.color,
        1.0, 0.0, 0.0   // Red
    );

    gl.bindVertexArray(triangle.vao);

    gl.drawArrays(
        triangle.drawMode,
        triangle.drawOffset,
        triangle.drawCount
    );

    // ---------------------------------------------------------
    // HEXAGON
    // ---------------------------------------------------------

    gl.uniform3f(
        shaderInfo.uniforms.color,
        1.0, 0.0, 1.0   // Magenta
    );

    gl.bindVertexArray(hexagon.vao);

    gl.drawArrays(
        hexagon.drawMode,
        hexagon.drawOffset,
        hexagon.drawCount
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

    setupTriangle(gl, shaderInfo);
    setupHexagon(gl, shaderInfo);



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
