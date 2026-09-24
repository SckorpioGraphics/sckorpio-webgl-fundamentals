/* #############################################################
CHAPTER 6b: Uniform

Topics:
- Adding a basic UI to manipulate
- R, G, B colors of the triangle (as three different float uniforms)
- Brightness of the triangle
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

    uniform float u_colorR;
    uniform float u_colorG;
    uniform float u_colorB;
    uniform float u_intensity;

    out vec4 out_color;

    void main() {
        out_color = vec4(
            u_colorR,
            u_colorG,
            u_colorB,
            1.0
        ) * u_intensity;
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
    // Color
    r: 0.39,
    g: 0.33,
    b: 0.58,

    // Intensity
    intensity: 1.0
};

function setupGUI(render) {
    const gui = new lil.GUI();

    const uniformFolder = gui.addFolder("Uniforms");

    const colorFolder = uniformFolder.addFolder("Color");
    colorFolder.add(uiState, "r", 0, 1).name("R").onChange(render);
    colorFolder.add(uiState, "g", 0, 1).name("G").onChange(render);
    colorFolder.add(uiState, "b", 0, 1).name("B").onChange(render);

    const intensityFolder = uniformFolder.addFolder("Intensity");
    intensityFolder.add(uiState, "intensity", 0, 1)
        .name("Intensity")
        .onChange(render);
}

// =============================================================
// 4. SHADER DATA
// =============================================================

const shader = {
    program: null,
    attributes: {
        position: null
    },
    uniforms: {
        colorR: null,
        colorG: null,
        colorB: null,
        intensity: null
    }
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

    shader.uniforms.colorR =
        gl.getUniformLocation(shader.program, "u_colorR");

    shader.uniforms.colorG =
        gl.getUniformLocation(shader.program, "u_colorG");

    shader.uniforms.colorB =
        gl.getUniformLocation(shader.program, "u_colorB");

    shader.uniforms.intensity =
        gl.getUniformLocation(shader.program, "u_intensity");
}

// =============================================================
// 7. OBJECT SETUP
// =============================================================

function setupTriangle(gl, shader) {
    triangle.shader = shader;

    triangle.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vbo);

    const positions = new Float32Array([
        -0.5, 0.0,
         0.0, 0.5,
         0.5, 0.0
    ]);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.DYNAMIC_DRAW
    );

    triangle.vao = gl.createVertexArray();
    gl.bindVertexArray(triangle.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vbo);

    gl.enableVertexAttribArray(triangle.shader.attributes.position);

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
    setupTriangle(gl, shader);

    function render() {
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.32, 0.63, 0.67, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(triangle.shader.program);

        // Set color uniforms
        gl.uniform1f(
            triangle.shader.uniforms.colorR,
            uiState.r
        );

        gl.uniform1f(
            triangle.shader.uniforms.colorG,
            uiState.g
        );

        gl.uniform1f(
            triangle.shader.uniforms.colorB,
            uiState.b
        );

        // Set intensity uniform
        gl.uniform1f(
            triangle.shader.uniforms.intensity,
            uiState.intensity
        );

        gl.bindVertexArray(triangle.vao);

        gl.drawArrays(
            triangle.drawMode,
            triangle.drawOffset,
            triangle.drawCount
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