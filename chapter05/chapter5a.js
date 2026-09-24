/* #############################################################
CHAPTER 5a: Varying

Topics:
- Using Vertex data itself for Vertex Color
- Adding a basic UI to manipulate
- Vertex positions
###############################################################
*/

// =============================================================
// 1. GLSL SHADER SOURCES
// =============================================================

const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    out vec4 v_color;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_color = gl_Position * 0.5 + 0.5;
    }
`;

const fragmentShaderSource = `#version 300 es
    precision highp float;

    in vec4 v_color;
    out vec4 out_color;

    void main() {
        out_color = v_color;
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
    // Vertices
    aX: -0.5,
    aY: 0.0,
    bX: 0.5,
    bY: 0.0,
    cX: 0.0,
    cY: 0.5
};

function setupGUI(render) {
    const gui = new lil.GUI();
    const vertexFolder = gui.addFolder("Vertex Positions");

    // Point A
    const pointAFolder = vertexFolder.addFolder("Point A");
    pointAFolder.add(uiState, "aX", -1, 1).name("X").onChange(render);
    pointAFolder.add(uiState, "aY", -1, 1).name("Y").onChange(render);

    // Point B
    const pointBFolder = vertexFolder.addFolder("Point B");
    pointBFolder.add(uiState, "bX", -1, 1).name("X").onChange(render);
    pointBFolder.add(uiState, "bY", -1, 1).name("Y").onChange(render);

    // Point C
    const pointCFolder = vertexFolder.addFolder("Point C");
    pointCFolder.add(uiState, "cX", -1, 1).name("X").onChange(render);
    pointCFolder.add(uiState, "cY", -1, 1).name("Y").onChange(render);
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

const triangle = {
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

    // No uniforms are needed for this lesson.
}

// =============================================================
// 7. OBJECT SETUP
// =============================================================

function setupTriangle(gl, shader) {
    triangle.shader = shader;

    // ---------------------------------------------------------
    // VERTEX BUFFER
    // ---------------------------------------------------------

    triangle.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vbo);

    // Vertex data will be updated from the UI during rendering.

    // ---------------------------------------------------------
    // VERTEX ARRAY
    // ---------------------------------------------------------

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

    // Draw data
    triangle.drawMode = gl.TRIANGLES;
    triangle.drawOffset = 0;
    triangle.drawCount = 3;
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
    setupTriangle(gl, shader);

    // RENDER
    function render() {
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.32, 0.63, 0.67, 1.0); // Sckorpio Cyan
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(triangle.shader.program);
        gl.bindVertexArray(triangle.vao);

        // Vertex data CPU side
        const positions = new Float32Array([
            uiState.aX, uiState.aY, // Point A
            uiState.bX, uiState.bY, // Point B
            uiState.cX, uiState.cY  // Point C
        ]);

        // Update vertex data on the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vbo);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            positions,
            gl.DYNAMIC_DRAW
        );

        gl.drawArrays(
            triangle.drawMode,
            triangle.drawOffset,
            triangle.drawCount
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