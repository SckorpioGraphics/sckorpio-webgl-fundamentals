/* #############################################################
CHAPTER 4c: Learning Topology LINE_LOOP

Topics:
- Making a Polygon to Circle
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
    radius: 0.5,
    points: 5
};

function setupGUI(render) {
    const gui = new lil.GUI();
    const polygonFolder = gui.addFolder("Polygon");

    // Center
    const centerFolder = polygonFolder.addFolder("Center");
    centerFolder.add(uiState, "centerX", -1, 1).name("centerX").onChange(render);
    centerFolder.add(uiState, "centerY", -1, 1).name("centerY").onChange(render);

    // Dimension
    const dimFolder = polygonFolder.addFolder("Dimensions");
    dimFolder.add(uiState, "radius", 0, 1).name("radius").onChange(render);
    dimFolder.add(uiState, "points", 3, 20, 1).name("points").onChange(render);
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

const polygon = {
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
    // Shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    // Program
    shader.program = createProgram(gl, vertexShader, fragmentShader);
    // Attributes
    shader.attributes.position = gl.getAttribLocation(shader.program, "a_position");
    // Future uniforms
}

// =============================================================
// 7. OBJECT SETUP
// =============================================================

function setupPolygon(gl, shader) {
    polygon.shader = shader;

    // ---------------------------------------------------------
    // VERTEX BUFFER
    // ---------------------------------------------------------

    polygon.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, polygon.vbo);

    // Vertex data will be generated from the UI during rendering.

    // ---------------------------------------------------------
    // INDEX BUFFER
    // ---------------------------------------------------------

    polygon.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polygon.ibo);

    // ---------------------------------------------------------
    // VERTEX ARRAY
    // ---------------------------------------------------------

    polygon.vao = gl.createVertexArray();
    gl.bindVertexArray(polygon.vao);

    gl.enableVertexAttribArray(polygon.shader.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, polygon.vbo);

    gl.vertexAttribPointer(
        polygon.shader.attributes.position,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    // Index buffer binding is stored inside the VAO.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polygon.ibo);

    // Draw data
    polygon.drawMode = gl.LINE_LOOP;
    polygon.drawOffset = 0;
    polygon.drawCount = 0;
    polygon.drawType = gl.UNSIGNED_SHORT;
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
    setupPolygon(gl, shader);

    // RENDER
    function render() {
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.32, 0.63, 0.67, 1.0); // Sckorpio Cyan
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(polygon.shader.program);
        gl.bindVertexArray(polygon.vao);

        // Vertex and index data CPU side
        const positionsData = [];
        const indicesData = [];

        for(let i = 0; i < uiState.points; i++) {
            const angle = (i / uiState.points) * (2 * Math.PI);

            const x = uiState.centerX +
                      Math.sin(angle) * uiState.radius;

            const y = uiState.centerY +
                      Math.cos(angle) * uiState.radius;

            positionsData.push(x);
            positionsData.push(y);

            indicesData.push(i);
        }

        const positions = new Float32Array(positionsData);
        const indices = new Uint16Array(indicesData);

        // Update vertex data on the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, polygon.vbo);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            positions,
            gl.DYNAMIC_DRAW
        );

        // Update index data on the GPU
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polygon.ibo);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            indices,
            gl.DYNAMIC_DRAW
        );

        // Update draw data
        polygon.drawCount = indices.length;

        gl.drawElements(
            polygon.drawMode,
            polygon.drawCount,
            polygon.drawType,
            polygon.drawOffset
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