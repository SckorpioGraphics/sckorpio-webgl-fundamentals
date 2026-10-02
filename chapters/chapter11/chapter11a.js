/* #############################################################
CHAPTER 11a: 2D Projection Matrix

Topics:
- Creating a projection matrix in GLSL Shader itself
- Camera space -> clip space
###############################################################
*/

// =============================================================
// GLOBAL OBJECTS
// =============================================================

// =============================================================
// Camera
// =============================================================

const camera = {
    // Camera bounds
    // [left = 0, right = width, bottom = 0, top = height]
    width: 0,
    height: 0

    // Clip space is fixed to [-1,1]
};

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

const shaderInfo = {
    vertexShaderSource: `#version 300 es
    in vec2 a_position;
    uniform vec2 u_cameraBounds;

    void main() {

        float width  = u_cameraBounds.x;
        float height = u_cameraBounds.y;

        // ---------------------------------------------------------
        // Projection Matrix
        // ---------------------------------------------------------

        mat3 projectionMatrix = mat3(
            2.0 / width,  0.0,          0.0,
            0.0,          2.0 / height, 0.0,
           -1.0,         -1.0,          1.0
        );

        // ---------------------------------------------------------
        // Camera Space -> Clip Space
        // ---------------------------------------------------------

        vec3 clipPosition = projectionMatrix * vec3(a_position, 1.0);
        gl_Position = vec4(clipPosition.xy,0.0,1.0);
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
        cameraBounds: null
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
    shader.uniforms.cameraBounds = gl.getUniformLocation(shader.program, "u_cameraBounds");
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
// Camera Functions
// =============================================================

function updateCamera(gl) {
    // Match the camera's viewing region
    camera.width = gl.canvas.width;
    camera.height = gl.canvas.height;
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
// RENDER
// =============================================================

function render(gl) {
    // INITIALISE
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    gl.clearColor(0.32, 0.63, 0.67, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // UPDATE CAMERA
    updateCamera(gl);

    // SHADER
    gl.useProgram(rectangle.shader.program);

    // Pass camera bounds to shader
    gl.uniform2f(
        rectangle.shader.uniforms.cameraBounds,
        camera.width,
        camera.height
    );

    // OBJECTS
    //----------------------------
    // Rectangle
    //----------------------------
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