/* #############################################################
CHAPTER 4b: Dynamic Buffer

Topics:
- Making a rectangle
- Adding a basic UI to manipulate
- Vertex positions
###############################################################
*/

// =============================================================
// 1. GLSL SHADER SOURCES
// =============================================================

const vertexShaderSource = `#version 300 es
    in vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `#version 300 es
    precision mediump float;
    out vec4 out_Color;

    void main() {
        // out_Color = vec4(0.0, 1.0, 1.0, 1.0); // Cyan
        out_Color = vec4(0.39, 0.33, 0.58, 1.0); // Sckorpio Purple
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

// =============================================================
// UI
// =============================================================

const uiState = {
    centerX: 0.0,
    centerY: 0.0,
    length: 0.5,
    width: 0.5
};

function setupGUI(render) {
    const gui = new lil.GUI();
    const rectangleFolder = gui.addFolder("Rectangle");

    // Center
    const centerFolder = rectangleFolder.addFolder("Center");
    centerFolder.add(uiState, "centerX", -1, 1).name("centerX").onChange(render);
    centerFolder.add(uiState, "centerY", -1, 1).name("centerY").onChange(render);

    // Dimension
    const dimFolder = rectangleFolder.addFolder("Dimensions");
    dimFolder.add(uiState, "length", 0, 2).name("length").onChange(render);
    dimFolder.add(uiState, "width", 0, 2).name("width").onChange(render);
}

// =============================================================
// 4. SHADER DATA
// =============================================================

const shader = {
    program: null,

    attributes: {
        position: null
    },

    uniforms: {}
};

// =============================================================
// 5. OBJECT DATA
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
// 6. SHADER SETUP
// =============================================================

function setupShader(gl) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    shader.program = createProgram(gl, vertexShader, fragmentShader);

    shader.attributes.position =
        gl.getAttribLocation(shader.program, "a_position");

    // Future uniforms will be stored here.
}

// =============================================================
// 7. OBJECT SETUP
// =============================================================

function setupRectangle(gl, shader) {
    rectangle.shader = shader;

    // ---------------------------------------------------------
    // VERTEX BUFFER
    // ---------------------------------------------------------

    rectangle.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);

    // Vertex data will be updated from the UI during rendering.

    // ---------------------------------------------------------
    // VERTEX ARRAY
    // ---------------------------------------------------------

    rectangle.vao = gl.createVertexArray();
    gl.bindVertexArray(rectangle.vao);

    gl.enableVertexAttribArray(rectangle.shader.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);

    gl.vertexAttribPointer(
        rectangle.shader.attributes.position,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    // Draw data
    rectangle.drawMode = gl.TRIANGLE_STRIP;
    rectangle.drawOffset = 0;
    rectangle.drawCount = 4;
}

// =============================================================
// 8. MAIN APPLICATION
// =============================================================

function main() {
    // WEBGL CANVAS
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

    // SETUP
    setupShader(gl);
    setupRectangle(gl, shader);

    // RENDER
    function render() {
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.32, 0.63, 0.67, 1.0); // Sckorpio Cyan
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(rectangle.shader.program);
        gl.bindVertexArray(rectangle.vao);

        // Vertex data CPU side
        const positions = new Float32Array([
            uiState.centerX - uiState.length / 2.0,
            uiState.centerY + uiState.width / 2.0, // Point 0

            uiState.centerX + uiState.length / 2.0,
            uiState.centerY + uiState.width / 2.0, // Point 1

            uiState.centerX - uiState.length / 2.0,
            uiState.centerY - uiState.width / 2.0, // Point 2

            uiState.centerX + uiState.length / 2.0,
            uiState.centerY - uiState.width / 2.0  // Point 3
        ]);

        // Update vertex data on the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            positions,
            gl.DYNAMIC_DRAW
        );

        gl.drawArrays(
            rectangle.drawMode,
            rectangle.drawOffset,
            rectangle.drawCount
        );
    }

    // UI
    setupGUI(render);

    render();
    window.addEventListener("resize", render);
}

// =============================================================
// 9. START
// =============================================================

window.addEventListener("DOMContentLoaded", main);

export {
    main
};