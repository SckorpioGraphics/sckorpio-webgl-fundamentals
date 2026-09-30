/* #############################################################
CHAPTER 10a: 2D World

Topics:
- Creating a grid in pixel space
- Also adding X-Axis and Y-Axis
- Creating a rectangle in pixel space
- Vertex data in pixel space
- projectionMatrix as a uniform mat3
- Pixel space -> clip space
- Multiple objects in pixel space
###############################################################*/

// =============================================================
// GLOBAL OBJECTS
// =============================================================

// =============================================================
// Scene Objects
// =============================================================

const xAxis = {
    shader: null,
    vao: null,
    vbo: null,
    drawMode: null,
    drawOffset: 0,
    drawCount: 0
};

const yAxis = {
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
// Camera Objects
// =============================================================

const camera = {
    projectionMatrix: null
}

// =============================================================
// 6. OBJECT DATA
// =============================================================

const grid = {
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

// No UI in this chapter yet.
// The focus here is on using a matrix
// to convert pixel space to clip space.

const shaderInfo = {
    vertexShaderSource: `#version 300 es
    in vec2 a_position;
    uniform mat3 u_projectionMatrix;

    void main() {
        // WORLD -> CAMERA
        vec2 cameraPosition = vec2(-300.0, -200.0); // Hardcoded camera position.
        vec2 viewPosition = a_position - cameraPosition;

        // CAMERA -> CLIP
        vec3 clipPosition = u_projectionMatrix * vec3(viewPosition, 1.0);

        gl_Position = vec4(clipPosition.xy, 0.0, 1.0);
    }
`,
    fragmentShaderSource: `#version 300 es
    precision mediump float;
    uniform vec4 u_color;
    out vec4 out_color;

    void main() {
        out_color = u_color;
    }
`,
    program: null,
    attributes: {
        position: null
    },
    uniforms: {
        projectionMatrix: null,
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

    // Uniforms
    shader.uniforms.projectionMatrix = gl.getUniformLocation(shader.program, "u_projectionMatrix");
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
// Camera-Related Matrix Functions
// =============================================================

function setupProjectionMatrix(gl){
    // PIXEL SPACE -> CLIP SPACE MATRIX
        const width = gl.canvas.width;
        const height = gl.canvas.height;

        /*
            Pixel -> Clip:

            x' = (2 * x / width) - 1
            y' = (2 * y / height) - 1

            Matrix:

            |  2/w    0     -1 |
            |   0    2/h    1 |
            |   0     0      1 |
        */

        camera.projectionMatrix = mat3.fromValues(
            2 / width,  0,           0,
            0,          2 / height,  0,
            -1,        -1,           1
        );
}

// =============================================================
// Scene Objects Creation Functions
// =============================================================

function setupGrid(gl, shader) {
    grid.shader = shader;

    const positions = [];
    const spacing = 100;
    const range = 10000;

    // Vertical lines
    for(let x = -range; x <= range; x += spacing) {
        positions.push(x, -range, x, range);
    }

    // Horizontal lines
    for(let y = -range; y <= range; y += spacing) {
        positions.push(-range, y, range, y);
    }

    grid.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grid.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    grid.vao = gl.createVertexArray();
    gl.bindVertexArray(grid.vao);
    gl.enableVertexAttribArray(grid.shader.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, grid.vbo);
    gl.vertexAttribPointer(grid.shader.attributes.position, 2, gl.FLOAT, false, 0, 0);

    grid.drawMode = gl.LINES;
    grid.drawOffset = 0;
    grid.drawCount = positions.length / 2;
}

function setupXAxis(gl, shader) {
    xAxis.shader = shader;

    const positions = new Float32Array([
        -10000, 0,
         10000, 0
    ]);

    xAxis.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, xAxis.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    xAxis.vao = gl.createVertexArray();
    gl.bindVertexArray(xAxis.vao);
    gl.enableVertexAttribArray(xAxis.shader.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, xAxis.vbo);
    gl.vertexAttribPointer(xAxis.shader.attributes.position, 2, gl.FLOAT, false, 0, 0);

    xAxis.drawMode = gl.LINES;
    xAxis.drawOffset = 0;
    xAxis.drawCount = 2;
}

function setupYAxis(gl, shader) {
    yAxis.shader = shader;

    const positions = new Float32Array([
        0, -10000,
        0,  10000
    ]);

    yAxis.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, yAxis.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    yAxis.vao = gl.createVertexArray();
    gl.bindVertexArray(yAxis.vao);
    gl.enableVertexAttribArray(yAxis.shader.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, yAxis.vbo);
    gl.vertexAttribPointer(yAxis.shader.attributes.position, 2, gl.FLOAT, false, 0, 0);

    yAxis.drawMode = gl.LINES;
    yAxis.drawOffset = 0;
    yAxis.drawCount = 2;
}

function setupRectangle(gl, shader) {
    rectangle.shader = shader;

    const positions = new Float32Array([
        200, 150, // Left Bottom
        400, 150, // Right Bottom
        200, 300, // Left Top

        200, 300, // Left Top
        400, 150, // Right Bottom
        400, 300  // Right Top
    ]);

    rectangle.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    rectangle.vao = gl.createVertexArray();
    gl.bindVertexArray(rectangle.vao);
    gl.enableVertexAttribArray(rectangle.shader.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);
    gl.vertexAttribPointer(rectangle.shader.attributes.position, 2, gl.FLOAT, false, 0, 0);

    rectangle.drawMode = gl.TRIANGLES;
    rectangle.drawOffset = 0;
    rectangle.drawCount = 6;
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

    setupProjectionMatrix(gl);
    gl.uniformMatrix3fv(shaderInfo.uniforms.projectionMatrix, false, camera.projectionMatrix);

    // GRID
    gl.bindVertexArray(grid.vao);
    gl.uniform4f(shaderInfo.uniforms.color, 0.39, 0.33, 0.58, 1.0);
    gl.drawArrays(grid.drawMode, grid.drawOffset, grid.drawCount);

    // X AXIS
    gl.bindVertexArray(xAxis.vao);
    gl.uniform4f(shaderInfo.uniforms.color, 1.0, 0.0, 0.0, 1.0);
    gl.drawArrays(xAxis.drawMode, xAxis.drawOffset, xAxis.drawCount);

    // Y AXIS
    gl.bindVertexArray(yAxis.vao);
    gl.uniform4f(shaderInfo.uniforms.color, 0.0, 1.0, 0.0, 1.0);
    gl.drawArrays(yAxis.drawMode, yAxis.drawOffset, yAxis.drawCount);

    // RECTANGLE
    gl.bindVertexArray(rectangle.vao);
    gl.uniform4f(shaderInfo.uniforms.color, 0.39, 0.33, 0.58, 1.0);
    gl.drawArrays(rectangle.drawMode, rectangle.drawOffset, rectangle.drawCount);
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
    setupXAxis(gl, shaderInfo);
    setupYAxis(gl, shaderInfo);
    setupRectangle(gl, shaderInfo);



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
