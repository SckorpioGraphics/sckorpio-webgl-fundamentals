/* #############################################################
CHAPTER 2d: Making a Geometry using Triangles (F Letter)

Topics:
- Letter F using Triangles
- Using Index Buffer
- Vertex Reuse
- drawElements()
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

const letterF = {
    shader: null,

    vao: null,
    vbo: null,
    ibo: null,

    drawMode: null,
    drawOffset: 0,
    drawCount: 0,
    drawType: null
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

function setupLetterF(gl, shader) {
    letterF.shader = shader;

    /*
        v2-------v3--------v4
        |\       |\         |
        |\       |   \      |
        | \      |      \   |
        |  \     v6________v5
        |   \    |
        |    \   v7_____v8
        |     \  |  \    |
        |      \ |    \  |
        |       \v10____v9
        |        |
        |        |
        v0_______v1
    */

    // ---------------------------------------------------------
    // VERTEX BUFFER
    // ---------------------------------------------------------

    const positions = new Float32Array([
        // Left column
        -0.4, -0.6,   // 0
        -0.2, -0.6,   // 1
        -0.4,  0.6,   // 2
        -0.2,  0.6,   // 3

        // Top bar
         0.2,  0.6,   // 4
         0.2,  0.4,   // 5
        -0.4,  0.4,   // 6

        // Middle bar
        -0.4,  0.2,   // 7
         0.1,  0.2,   // 8
         0.1,  0.0,   // 9
        -0.4,  0.0    // 10
    ]);

    letterF.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, letterF.vbo);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
    );

    // ---------------------------------------------------------
    // INDEX BUFFER
    // ---------------------------------------------------------

    const indices = new Uint16Array([
        // LEFT COLUMN
        0, 1, 2,
        2, 1, 3,

        // TOP BAR
        3, 6, 5,
        3, 5, 4,

        // MIDDLE BAR
        7, 10, 9,
        7, 9, 8
    ]);

    letterF.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, letterF.ibo);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        indices,
        gl.STATIC_DRAW
    );

    // ---------------------------------------------------------
    // VERTEX ARRAY
    // ---------------------------------------------------------

    letterF.vao = gl.createVertexArray();
    gl.bindVertexArray(letterF.vao);

    gl.enableVertexAttribArray(letterF.shader.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, letterF.vbo);

    gl.vertexAttribPointer(
        letterF.shader.attributes.position,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    // Index buffer binding is stored inside the VAO.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, letterF.ibo);

    // Draw data
    letterF.drawMode = gl.TRIANGLES;
    letterF.drawOffset = 0;
    letterF.drawCount = indices.length;
    letterF.drawType = gl.UNSIGNED_SHORT;
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
    setupLetterF(gl, shader);

    // RENDER
    function render() {
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.32, 0.63, 0.67, 1.0); // Sckorpio Cyan
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(letterF.shader.program);
        gl.bindVertexArray(letterF.vao);

        gl.drawElements(
            letterF.drawMode,
            letterF.drawCount,
            letterF.drawType,
            letterF.drawOffset
        );
    }

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