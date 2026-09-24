/* #############################################################
CHAPTER 6e: All Types of Uniforms

Topics:
- Just showing all types of Uniforms passing ways
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

    uniform vec3 u_color;
    uniform float u_intensity;

    out vec4 out_color;

    void main() {
        out_color = vec4(u_color, 1.0) * u_intensity;
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
    R: 0.39,
    G: 0.33,
    B: 0.58,

    // Intensity
    intensity: 1.0
};

function setupGUI(render) {
    const gui = new lil.GUI();

    const uniformFolder = gui.addFolder("Uniforms");

    // Color
    const colorFolder = uniformFolder.addFolder("Color");
    colorFolder.add(uiState, "R", 0, 1).name("R").onChange(render);
    colorFolder.add(uiState, "G", 0, 1).name("G").onChange(render);
    colorFolder.add(uiState, "B", 0, 1).name("B").onChange(render);

    // Intensity
    const intensityFolder = uniformFolder.addFolder("Intensity");
    intensityFolder.add(uiState, "intensity", 0, 1).name("Intensity").onChange(render);
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
        color: null,
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
    // Shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    // Program
    shader.program = createProgram(gl, vertexShader, fragmentShader);
    // Attributes
    shader.attributes.position = gl.getAttribLocation(shader.program, "a_position");
    // uniforms
    shader.uniforms.color = gl.getUniformLocation(shader.program, "u_color");
    shader.uniforms.intensity = gl.getUniformLocation(shader.program, "u_intensity");
}

// =============================================================
// 7. OBJECT SETUP
// =============================================================

function setupTriangle(gl, shader) {
    triangle.shader = shader;

    triangle.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vbo);

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

        // Set uniform color
        gl.uniform3fv(
            triangle.shader.uniforms.color,
            [uiState.R, uiState.G, uiState.B]
        );

        // Set uniform intensity
        gl.uniform1f(
            triangle.shader.uniforms.intensity,
            uiState.intensity
        );

        // ---------------------------------------------------------
        // MORE WAYS OF PASSING UNIFORMS
        // ---------------------------------------------------------

        /*
        // Float
        gl.uniform1f(floatUniformLoc, v);
        gl.uniform1fv(floatUniformLoc, [v]);

        // vec2
        gl.uniform2f(vec2UniformLoc, v0, v1);
        gl.uniform2fv(vec2UniformLoc, [v0, v1]);

        // vec3
        gl.uniform3f(vec3UniformLoc, v0, v1, v2);
        gl.uniform3fv(vec3UniformLoc, [v0, v1, v2]);

        // vec4
        gl.uniform4f(vec4UniformLoc, v0, v1, v2, v3);
        gl.uniform4fv(vec4UniformLoc, [v0, v1, v2, v3]);

        // mat2
        gl.uniformMatrix2fv(
            mat2UniformLoc,
            false,
            [4x element array]
        );

        // mat3
        gl.uniformMatrix3fv(
            mat3UniformLoc,
            false,
            [9x element array]
        );

        // mat4
        gl.uniformMatrix4fv(
            mat4UniformLoc,
            false,
            [16x element array]
        );

        // int
        gl.uniform1i(intUniformLoc, v);
        gl.uniform1iv(intUniformLoc, [v]);

        // ivec2
        gl.uniform2i(ivec2UniformLoc, v0, v1);
        gl.uniform2iv(ivec2UniformLoc, [v0, v1]);

        // ivec3
        gl.uniform3i(ivec3UniformLoc, v0, v1, v2);
        gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);

        // ivec4
        gl.uniform4i(ivec4UniformLoc, v0, v1, v2, v3);
        gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v3]);

        // uint
        gl.uniform1ui(uintUniformLoc, v);
        gl.uniform1uiv(uintUniformLoc, [v]);

        // uvec2
        gl.uniform2ui(uvec2UniformLoc, v0, v1);
        gl.uniform2uiv(uvec2UniformLoc, [v0, v1]);

        // uvec3
        gl.uniform3ui(uvec3UniformLoc, v0, v1, v2);
        gl.uniform3uiv(uvec3UniformLoc, [v0, v1, v2]);

        // uvec4
        gl.uniform4ui(uvec4UniformLoc, v0, v1, v2, v3);
        gl.uniform4uiv(uvec4UniformLoc, [v0, v1, v2, v3]);

        // Samplers:
        // sampler2D, sampler3D, samplerCube,
        // samplerCubeShadow, sampler2DShadow,
        // sampler2DArray, sampler2DArrayShadow

        gl.uniform1i(samplerUniformLoc, v);
        gl.uniform1iv(samplerUniformLoc, [v]);
        */

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