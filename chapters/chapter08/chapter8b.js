/* #############################################################
CHAPTER 8b: Uniform

Topics:
- Adding a basic UI to manipulate
- R, G, B colors of the triangle (as three different float uniforms)
- Brightness of the triangle
###############################################################
*/

// =============================================================
// GLOBAL OBJECTS
// =============================================================

// =============================================================
// Scene Objects
// =============================================================

const uiState = {
    // Color
    r: 0.39,
    g: 0.33,
    b: 0.58,

    // Intensity
    intensity: 1.0
};

const triangle = {
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

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`,
    fragmentShaderSource: `#version 300 es
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
`,
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
    shader.uniforms.colorR = gl.getUniformLocation(shader.program, "u_colorR");
    shader.uniforms.colorG = gl.getUniformLocation(shader.program, "u_colorG");
    shader.uniforms.colorB = gl.getUniformLocation(shader.program, "u_colorB");
    shader.uniforms.intensity = gl.getUniformLocation(shader.program, "u_intensity");
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
// GUI Setup Functions
// =============================================================

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
// RENDER
// =============================================================
function render(gl) {
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
    setupTriangle(gl, shaderInfo);
    setupGUI(() => render(gl));

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
