/* #############################################################
CHAPTER 5f: Rectangle with 2 triangles with different colors

Topics:
- Making a rectangle with 2 different triangles
- Each vertex has 3 point data, same coords but different colors
###############################################################
*/

// =============================================================
// 1. GLSL SHADER SOURCES
// =============================================================

const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    in vec3 a_color;

    out vec4 v_color;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_color = vec4(a_color, 1.0);
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
    // Vertex Positions
    aX: -0.5,
    aY: -0.5,
    bX: 0.5,
    bY: -0.5,
    cX: 0.5,
    cY: 0.5,
    dX: -0.5,
    dY: 0.5,

    // Triangle 1 Color
    pR: 1.0,
    pG: 0.0,
    pB: 0.0,

    // Triangle 2 Color
    qR: 0.0,
    qG: 1.0,
    qB: 0.0
};

function setupGUI(render) {
    const gui = new lil.GUI();

    const verticesFolder = gui.addFolder("Vertices");

    // Point A
    const pointAFolder = verticesFolder.addFolder("Point A");
    pointAFolder.add(uiState, "aX", -1, 1).name("X").onChange(render);
    pointAFolder.add(uiState, "aY", -1, 1).name("Y").onChange(render);

    // Point B
    const pointBFolder = verticesFolder.addFolder("Point B");
    pointBFolder.add(uiState, "bX", -1, 1).name("X").onChange(render);
    pointBFolder.add(uiState, "bY", -1, 1).name("Y").onChange(render);

    // Point C
    const pointCFolder = verticesFolder.addFolder("Point C");
    pointCFolder.add(uiState, "cX", -1, 1).name("X").onChange(render);
    pointCFolder.add(uiState, "cY", -1, 1).name("Y").onChange(render);

    // Point D
    const pointDFolder = verticesFolder.addFolder("Point D");
    pointDFolder.add(uiState, "dX", -1, 1).name("X").onChange(render);
    pointDFolder.add(uiState, "dY", -1, 1).name("Y").onChange(render);

    const colorFolder = gui.addFolder("Color");

    // Triangle 1
    const triangle1ColorFolder = colorFolder.addFolder("Triangle 1");
    triangle1ColorFolder.add(uiState, "pR", 0, 1).name("R").onChange(render);
    triangle1ColorFolder.add(uiState, "pG", 0, 1).name("G").onChange(render);
    triangle1ColorFolder.add(uiState, "pB", 0, 1).name("B").onChange(render);

    // Triangle 2
    const triangle2ColorFolder = colorFolder.addFolder("Triangle 2");
    triangle2ColorFolder.add(uiState, "qR", 0, 1).name("R").onChange(render);
    triangle2ColorFolder.add(uiState, "qG", 0, 1).name("G").onChange(render);
    triangle2ColorFolder.add(uiState, "qB", 0, 1).name("B").onChange(render);
}

// =============================================================
// 4. SHADER DATA
// =============================================================

const shader = {
    program: null,
    attributes: {
        position: null,
        color: null
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

    shader.attributes.color =
        gl.getAttribLocation(shader.program, "a_color");

    // No uniforms are needed for this lesson.
}

// =============================================================
// 7. OBJECT SETUP
// =============================================================

function setupRectangle(gl, shader) {
    rectangle.shader = shader;

    rectangle.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);

    rectangle.vao = gl.createVertexArray();
    gl.bindVertexArray(rectangle.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);

    // Vertex positions
    gl.enableVertexAttribArray(rectangle.shader.attributes.position);
    gl.vertexAttribPointer(
        rectangle.shader.attributes.position,
        2,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    );

    // Vertex colors
    gl.enableVertexAttribArray(rectangle.shader.attributes.color);
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
// 8. MAIN APPLICATION
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
    setupRectangle(gl, shader);

    function render() {
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.32, 0.63, 0.67, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(rectangle.shader.program);
        gl.bindVertexArray(rectangle.vao);

        // Interleaved vertex data CPU side
        // Each vertex = X, Y, R, G, B
        //
        // Triangle 1: A -> B -> C
        // Triangle 2: A -> C -> D
        //
        // Same positions A and C are repeated,
        // but with different colors.

        const vertexData = new Float32Array([
            // Triangle 1
            uiState.aX, uiState.aY,
            uiState.pR, uiState.pG, uiState.pB,

            uiState.bX, uiState.bY,
            uiState.pR, uiState.pG, uiState.pB,

            uiState.cX, uiState.cY,
            uiState.pR, uiState.pG, uiState.pB,

            // Triangle 2
            uiState.aX, uiState.aY,
            uiState.qR, uiState.qG, uiState.qB,

            uiState.cX, uiState.cY,
            uiState.qR, uiState.qG, uiState.qB,

            uiState.dX, uiState.dY,
            uiState.qR, uiState.qG, uiState.qB
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.vbo);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            vertexData,
            gl.DYNAMIC_DRAW
        );

        gl.drawArrays(
            rectangle.drawMode,
            rectangle.drawOffset,
            rectangle.drawCount
        );
    }

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