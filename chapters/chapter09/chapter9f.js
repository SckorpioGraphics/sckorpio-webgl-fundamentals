/* #############################################################
   CHAPTER 9e: 2D Camera — Keyboard Controls

   Topics:
   - Camera position
   - Camera zoom
   - View matrix
   - Keyboard input
   - Continuous camera movement
   - Key states
   - GUI camera controls
   #############################################################
*/

// =============================================================
// 1. GLSL SHADER SOURCES
// =============================================================

const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    uniform mat3 u_viewMatrix;
    uniform mat3 u_projectionMatrix;

    void main() {
        vec3 viewPosition = u_viewMatrix * vec3(a_position, 1.0);
        vec3 clipPosition = u_projectionMatrix * viewPosition;
        gl_Position = vec4(clipPosition.xy, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `#version 300 es
    precision mediump float;
    uniform vec4 u_color;
    out vec4 out_color;

    void main() {
        out_color = u_color;
    }
`;

// =============================================================
// 2. WEBGL UTILITY FUNCTIONS
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

// =============================================================
// 3. HELPER FUNCTIONS
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

function createViewMatrix(camera) {
    const matrix = mat3.create();
    mat3.fromTranslation(matrix, [-camera.x, -camera.y]);
    mat3.scale(matrix, matrix, [camera.zoom, camera.zoom]);
    return matrix;
}

// =============================================================
// CAMERA
// =============================================================

const camera = {
    x: -300,
    y: -200,
    zoom: 1.0,
    panSpeed: 10,
    zoomSpeed: 0.1,
    viewMatrix: null,
    projectionMatrix: null
};

function setupViewMatrix() {
    const matrix = mat3.create();
    mat3.fromTranslation(matrix, [-camera.x, -camera.y]);
    mat3.scale(matrix, matrix, [camera.zoom, camera.zoom]);
    camera.viewMatrix = matrix;
}

const controls = {
    up: false,
    left: false,
    down: false,
    right: false,
    zoomIn: false,
    zoomOut: false
};

function updateCamera() {
    if(controls.up || keys["arrowup"] || keys["w"]) camera.y -= camera.panSpeed;
    if(controls.left || keys["arrowleft"] || keys["a"]) camera.x -= camera.panSpeed;
    if(controls.down || keys["arrowdown"] || keys["s"]) camera.y += camera.panSpeed;
    if(controls.right || keys["arrowright"] || keys["d"]) camera.x += camera.panSpeed;
    if(controls.zoomIn || keys["i"]) camera.zoom += camera.zoomSpeed;
    if(controls.zoomOut || keys["o"]) camera.zoom = Math.max(0.1, camera.zoom - camera.zoomSpeed);
}

// =============================================================
// GUI
// =============================================================

function setupGUI() {
    const gui = new lil.GUI();
    const cameraFolder = gui.addFolder("Camera");

    cameraFolder.add(controls, "up").name("↑ Up");
    cameraFolder.add(controls, "left").name("← Left");
    cameraFolder.add(controls, "down").name("↓ Down");
    cameraFolder.add(controls, "right").name("→ Right");
    cameraFolder.add(controls, "zoomIn").name("Zoom In");
    cameraFolder.add(controls, "zoomOut").name("Zoom Out");
}

// =============================================================
// SHADER DATA
// =============================================================

const shader = {
    program: null,
    attributes: {
        position: null
    },
    uniforms: {
        viewMatrix: null,
        projectionMatrix: null,
        color: null
    }
};

// =============================================================
// OBJECT DATA
// =============================================================

const grid = {
    shader: null,
    vao: null,
    vbo: null,
    drawMode: null,
    drawOffset: 0,
    drawCount: 0
};

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
// SHADER SETUP
// =============================================================

function setupShader(gl) {
    // Shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Program
    shader.program = createProgram(gl, vertexShader, fragmentShader);

    // Attributes
    shader.attributes.position = gl.getAttribLocation(shader.program, "a_position");

    // Uniforms
    shader.uniforms.viewMatrix = gl.getUniformLocation(shader.program, "u_viewMatrix");
    shader.uniforms.projectionMatrix = gl.getUniformLocation(shader.program, "u_projectionMatrix");
    shader.uniforms.color = gl.getUniformLocation(shader.program, "u_color");
}

// =============================================================
// OBJECT SETUP
// =============================================================

function setupGrid(gl, shader) {
    grid.shader = shader;

    const positions = [];
    const spacing = 100;
    const range = 10000;

    for(let x = -range; x <= range; x += spacing) {
        positions.push(x, -range, x, range);
    }

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
        200, 150,
        400, 150,
        200, 300,
        200, 300,
        400, 150,
        400, 300
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
// 9. SCENE SETUP
// =============================================================
function setupProjectionMatrix(gl){
    // PIXEL SPACE -> CLIP SPACE MATRIX
    const width = gl.canvas.width;
    const height = gl.canvas.height;

    /*
        Pixel -> Clip:

        x' = (2 * x / width) - 1
        y' = 1 - (2 * y / height)

        Matrix:

        |  2/w    0     -1 |
        |   0    -2/h    1 |
        |   0     0      1 |
    */

    camera.projectionMatrix = mat3.fromValues(
        2 / width,  0,           0,
        0,         -2 / height, 0,
        -1,         1,          1
    );
}

// =============================================================
// KEYBOARD INPUT
// =============================================================

const keys = {};

window.addEventListener("keydown", event => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;
});

// =============================================================
// MAIN APPLICATION
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

    setupShader(gl);
    setupGrid(gl, shader);
    setupXAxis(gl, shader);
    setupYAxis(gl, shader);
    setupRectangle(gl, shader);

    function render() {
        updateCamera();

        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.32, 0.63, 0.67, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(shader.program);

        // PROJECTION MATRIX
        setupProjectionMatrix(gl);
        gl.uniformMatrix3fv(shader.uniforms.projectionMatrix, false, camera.projectionMatrix);

        // VIEW MATRIX
        setupViewMatrix();
        gl.uniformMatrix3fv(shader.uniforms.viewMatrix, false, camera.viewMatrix);

        gl.bindVertexArray(grid.vao);
        gl.uniform4f(shader.uniforms.color, 0.39, 0.33, 0.58, 1.0);
        gl.drawArrays(grid.drawMode, grid.drawOffset, grid.drawCount);

        gl.bindVertexArray(xAxis.vao);
        gl.uniform4f(shader.uniforms.color, 1.0, 0.0, 0.0, 1.0);
        gl.drawArrays(xAxis.drawMode, xAxis.drawOffset, xAxis.drawCount);

        gl.bindVertexArray(yAxis.vao);
        gl.uniform4f(shader.uniforms.color, 0.0, 1.0, 0.0, 1.0);
        gl.drawArrays(yAxis.drawMode, yAxis.drawOffset, yAxis.drawCount);

        gl.bindVertexArray(rectangle.vao);
        gl.uniform4f(shader.uniforms.color, 0.39, 0.33, 0.58, 1.0);
        gl.drawArrays(rectangle.drawMode, rectangle.drawOffset, rectangle.drawCount);

        requestAnimationFrame(render);
    }

    setupGUI();
    render();
}

// =============================================================
// 9. START
// =============================================================

window.addEventListener("DOMContentLoaded", main);

export {
    main
};