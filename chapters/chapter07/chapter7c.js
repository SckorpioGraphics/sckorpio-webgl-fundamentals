/* #############################################################
CHAPTER 7c: Multiple Objects

Topics:
- Rendering multiple objects
- A Triangle and a Rectangle
- Separate VAO/VBO for each object
- Different shaders
- Different colors
- Multiple draw calls
- Using vertex colors and uniform colors
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

const triangle = {
    shader: null,
    vao: null,
    vbo: null,
    drawMode: null,
    drawOffset: 0,
    drawCount: 0
};

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
    The focus here is on rendering multiple
    independent objects with different shaders.
*/

const basicShaderInfo = {
    fragmentShaderSource: `#version 300 es
    precision mediump float;

    uniform vec3 u_color;

    out vec4 out_color;

    void main() {
        out_color = vec4(u_color, 1.0);
    }
`,
    vertexShaderSource: `#version 300 es
    in vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
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

const vertexColorShaderInfo = {
    fragmentShaderSource: `#version 300 es
    precision highp float;

    in vec4 v_color;

    out vec4 out_color;

    void main() {
        out_color = v_color;
    }
`,
    vertexShaderSource: `#version 300 es
    in vec2 a_position;
    in vec3 a_color;

    out vec4 v_color;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_color = vec4(a_color, 1.0);
    }
`,
    program: null,
    attributes: {
        position: null,
        color: null
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

function setupBasicShader(gl) {
    const vertexShader = createShader(gl,gl.VERTEX_SHADER,basicShaderInfo.vertexShaderSource);
    const fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,basicShaderInfo.fragmentShaderSource);
    basicShaderInfo.program = createProgram(gl,vertexShader,fragmentShader);
    basicShaderInfo.attributes.position = gl.getAttribLocation(basicShaderInfo.program,"a_position");
    basicShaderInfo.uniforms.color = gl.getUniformLocation(basicShaderInfo.program,"u_color");
}

function setupcolorVertexShader(gl) {
    const vertexShader = createShader(gl,gl.VERTEX_SHADER,vertexColorShaderInfo.vertexShaderSource);
    const fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,vertexColorShaderInfo.fragmentShaderSource);
    vertexColorShaderInfo.program = createProgram(gl,vertexShader,fragmentShader);
    vertexColorShaderInfo.attributes.position = gl.getAttribLocation(vertexColorShaderInfo.program,"a_position");
    vertexColorShaderInfo.attributes.color = gl.getAttribLocation(vertexColorShaderInfo.program,"a_color");
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

function setupRectangle(gl, shader) {
    rectangle.shader = shader;

    // X, Y, R, G, B
    const vertexData = new Float32Array([
        0.2, -0.2,  1.0, 0.0, 0.0,
        0.2,  0.2,  0.0, 1.0, 0.0,
        0.6, -0.2,  0.0, 0.0, 1.0,

        0.6, -0.2,  0.0, 0.0, 1.0,
        0.6,  0.2,  1.0, 1.0, 0.0,
        0.2,  0.2,  0.0, 1.0, 0.0
    ]);

    rectangle.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        vertexData,
        gl.STATIC_DRAW
    );

    rectangle.vao = gl.createVertexArray();
    gl.bindVertexArray(rectangle.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);

    // Vertex positions
    gl.enableVertexAttribArray(
        rectangle.shader.attributes.position
    );

    gl.vertexAttribPointer(
        rectangle.shader.attributes.position,
        2,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    // Vertex colors
    gl.enableVertexAttribArray(
        rectangle.shader.attributes.color
    );

    gl.vertexAttribPointer(
        rectangle.shader.attributes.color,
        3,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    rectangle.drawMode = gl.TRIANGLES;
    rectangle.drawOffset = 0;
    rectangle.drawCount = 6;
}

// =============================================================
// RENDER
// =============================================================
function render() {
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.32, 0.63, 0.67, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ---------------------------------------------------------
    // TRIANGLE
    // ---------------------------------------------------------

    gl.useProgram(triangle.shader.program);

    gl.uniform3f(
        triangle.shader.uniforms.color,
        1.0, 0.0, 0.0   // Red
    );

    gl.bindVertexArray(triangle.vao);

    gl.drawArrays(
        triangle.drawMode,
        triangle.drawOffset,
        triangle.drawCount
    );

    // ---------------------------------------------------------
    // RECTANGLE
    // ---------------------------------------------------------

    gl.useProgram(rectangle.shader.program);

    gl.bindVertexArray(rectangle.vao);

    gl.drawArrays(
        rectangle.drawMode,
        rectangle.drawOffset,
        rectangle.drawCount
    );
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

    setupBasicShader(gl);
    setupcolorVertexShader(gl);

    setupTriangle(gl, basicShaderInfo);
    setupRectangle(gl, vertexColorShaderInfo);



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
