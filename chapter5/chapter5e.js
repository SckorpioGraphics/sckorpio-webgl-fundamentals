/* #############################################################
CHAPTER 5e: 2D Transformations

Topics:
- Making a colored triangle
- bY passing the color as uniform

ALSO
- 3x3 transformation matrices
- Translation
- Rotation
- Scaling
- Matrix multiplication
- Projection matrix
- Vertex Array Object
- gl-matrix
- Interactive controls with lil-gui
###############################################################
*/

// =============================================================
// 1. GLSL Shader Sources
// =============================================================

const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    uniform mat3 u_viewProjection;
    uniform mat3 u_model;

    void main() {
        gl_Position = vec4((u_viewProjection * u_model * vec3(a_position, 1.0)).xy, 0.0, 1.0);
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

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (compileStatus) return shader;

    console.error("Shader Compilation Error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (linkStatus) return program;

    console.error("Program Linking Error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

// =============================================================
// 2. Helper Functions
// =============================================================

function resizeCanvasToDisplaySize(canvas, multiplier = 1) {
    const width = (canvas.clientWidth * multiplier) | 0;
    const height = (canvas.clientHeight * multiplier) | 0;

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

// =============================================================
// 0. GUI using.. lil-gui
// =============================================================

var state = {
    x: 200,
    y: 150,
    angle: 0,
    scaleX: 1,
    scaleY: 1
};

function setupGUI(canvas, render) {
    const gui = new lil.GUI();
    const transformFolder = gui.addFolder("Transform");
    transformFolder.add(state, "x", 0, canvas.clientWidth).name("Translation X").onChange(render);
    transformFolder.add(state, "y", 0, canvas.clientHeight).name("Translation Y").onChange(render);
    transformFolder.add(state, "angle", 0, 360).name("Rotation").onChange(render);
    transformFolder.add(state, "scaleX", -5, 5, 0.01).name("Scale X").onChange(render);
    transformFolder.add(state, "scaleY", -5, 5, 0.01).name("Scale Y").onChange(render);
}


// =============================================================
// 3. Main Application Entry Point
// =============================================================

function main() {
    // -------------------------------------------------------------
    // 1. WEBGL CANVAS
    // -------------------------------------------------------------
    // canvas
    const canvas = document.querySelector("#c");
    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }
    // context
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        console.error("WebGL2 is not supported by this browser");
        return;
    }
    // GUI
    setupGUI(canvas, render);

    // -------------------------------------------------------------
    // 2. SHADERS
    // -------------------------------------------------------------
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Save Attribute & Uniform locations
    const locationAttributePosition = gl.getAttribLocation(program, "a_position");
    const locationUniformMatrix = gl.getUniformLocation(program, "u_viewProjection");
    const locationUniformModel = gl.getUniformLocation(program, "u_model");
    const locationUniformColor = gl.getUniformLocation(program, "u_color");

    // -------------------------------------------------------------
    // 3. DATA & BUFFERS
    // -------------------------------------------------------------
    // VERTEX BUFFER
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
             0, -100,
           150,  125,
          -175,  100
        ]),
        gl.STATIC_DRAW
    );

    // -------------------------------------------------------------
    // 4. VERTEX ARRAY
    // -------------------------------------------------------------

    // vao: vertex array object
    const vao = gl.createVertexArray();

    // bind the vertex array
    gl.bindVertexArray(vao);

    // enable the position attribute
    gl.enableVertexAttribArray(locationAttributePosition);

    // bind the vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // Buffer data format
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.vertexAttribPointer(
        locationAttributePosition,
        size,
        type,
        normalize,
        stride,
        offset
    );

    // =============================================================
    // 6. RENDER
    // =============================================================

    function render() {
        // CANVAS
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // BACKGROUND
        //gl.clearColor(0.39, 0.33, 0.58, 1.0); // Purple
        gl.clearColor(0.0, 1.0, 1.0, 1.0);    // Cyan
        gl.clear(gl.COLOR_BUFFER_BIT);

        // SHADER
        gl.useProgram(program);

        // BUFFER / DATA
        // The VAO remembers the vertex attribute configuration.
        gl.bindVertexArray(vao);

        // ---------------------------------------------------------
        // TRANSFORMATION MATRIX
        // ---------------------------------------------------------
        const viewProjection = mat3.fromValues(
             2 / gl.canvas.width,   0,                      0,
             0,                     -2 / gl.canvas.height,  0,
            -1,                     1,                      1
        );

        const model = mat3.create();
        // Translation
        mat3.translate(model, model, [state.x, state.y]);
        // Rotation
        const angleInRadians = state.angle * Math.PI / 180;
        mat3.rotate(model, model, angleInRadians);
        // Scaling
        mat3.scale(model, model, [state.scaleX, state.scaleY]);

        // Upload transformation matrix
        gl.uniformMatrix3fv(locationUniformMatrix,false,viewProjection);
        gl.uniformMatrix3fv(locationUniformModel,false,model);

        // Color 
        gl.uniform4fv(locationUniformColor,[0.39, 0.33, 0.58, 1.0]); // Purple
        //gl.uniform4fv(locationUniformColor,[0.0, 1.0, 1.0, 1.0]); // Cyan


        // ---------------------------------------------------------
        // DRAW CALL
        // ---------------------------------------------------------

        const draw_primitiveType = gl.TRIANGLES;
        const draw_offset = 0;
        const draw_count = 3;

        gl.drawArrays(
            draw_primitiveType,
            draw_offset,
            draw_count
        );
    }

    render();

    // Listen for Window resize
    window.addEventListener("resize", render);
}

// Start app once DOM content is ready
window.addEventListener("DOMContentLoaded", main);

export {
    main
};