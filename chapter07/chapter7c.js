/* #############################################################
CHAPTER 7C:
- Creating a Basic Rectangle
- Vertex Data in Pixel Space
- Pixel Space -> Clip Space using a Matrix

Topics:
- Matrix as a Uniform
- mat3
- Pixel Space -> Clip Space
- Inverted Y
###############################################################
*/

// =============================================================
// 1. GLSL SHADER SOURCES
// =============================================================

// NEW WebGL 2.0 Way...
// -------------------------------------------------------------
// basic vertex shader
// using a matrix to convert pixel space to clip space
const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    uniform mat3 u_pixelMatrix;

    void main() {
        // Convert vec2 position to homogeneous vec3
        vec3 position = vec3(a_position, 1.0);

        // Apply pixel -> clip space matrix
        vec3 transformedPosition = u_pixelMatrix * position;

        // Convert to clip-space position
        gl_Position = vec4(transformedPosition.xy, 0.0, 1.0);
    }
`;

// basic fragment shader
// using cyan/purple color for the pixel (sckorpio branding)
const fragmentShaderSource = `#version 300 es
    precision mediump float;
    out vec4 out_Color;

    void main() {
        out_Color = vec4(0.39, 0.33, 0.58, 1.0); // Sckorpio-Purple
    }
`;

/**
 * Compiles a GLSL shader.
 */
function createShader(gl, type, source) {
    // create a shader of 'type'
    const shader = gl.createShader(type);

    // pass the shader source string
    gl.shaderSource(shader, source);

    // compile the shader
    gl.compileShader(shader);

    // get compile status of shader
    const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    // if status = success : return shader
    if (compileStatus) return shader;

    // else log it
    console.error("Shader Compilation Error:", gl.getShaderInfoLog(shader));

    // delete the shader
    gl.deleteShader(shader);
}

/**
 * Links vertex and fragment shaders into a GPU program.
 */
function createProgram(gl, vertexShader, fragmentShader) {
    // create a program
    const program = gl.createProgram();

    // attach the vertex shader
    gl.attachShader(program, vertexShader);

    // attach the fragment shader
    gl.attachShader(program, fragmentShader);

    // finally link them together
    gl.linkProgram(program);

    // get link status of program
    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);

    // if link status success
    if (linkStatus) return program;

    // else log it
    console.error("Program Linking Error:", gl.getProgramInfoLog(program));

    // delete the program
    gl.deleteProgram(program);
}

// =============================================================
// 2. HELPER FUNCTIONS
// =============================================================

/**
 * Resizes the internal drawing buffer to match screen CSS display pixels.
 */
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
// 3. MAIN APPLICATION ENTRY POINT
// =============================================================

function main() {
    // -------------------------------------------------------------
    // 1. WEBGL CANVAS
    // -------------------------------------------------------------

    // Get the Canvas
    const canvas = document.querySelector("#c");

    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }

    // Get the WebGL context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("WebGL2 is not supported by this browser");
        return;
    }

    // -------------------------------------------------------------
    // 2. SHADERS
    // -------------------------------------------------------------

    // Compile Shader & Create Program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Save Attribute locations
    const locationAttributePosition = gl.getAttribLocation(program, "a_position");

    // Save Uniform locations
    const locationUniformPixelMatrix = gl.getUniformLocation(program, "u_pixelMatrix");

    // -------------------------------------------------------------
    // 3. DATA & BUFFERS
    // -------------------------------------------------------------

    // OBJECT 1
    // VERTEX BUFFER
    const vbo = gl.createBuffer();

    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // Vertex data CPU side
    const positions = new Float32Array([
        20, 20,     // Left Bottom
        200, 20,    // Right Bottom
        20, 100,    // Left Top

        20, 100,    // Left Top
        200, 20,    // Right Bottom
        200, 100    // Right Top
    ]);

    // Feed the vertex data to buffer GPU
    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
    );

    // -------------------------------------------------------------
    // 4. VERTEX ARRAY
    // -------------------------------------------------------------

    // vao: vertex array object
    const vao = gl.createVertexArray();

    // bind the vertex array
    gl.bindVertexArray(vao);

    // enable that attrib
    gl.enableVertexAttribArray(locationAttributePosition);

    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // Buffer data format
    const size = 2;          // 2 components (X, Y) per vertex
    const type = gl.FLOAT;   // 32-bit float values
    const normalize = false; // Do not normalize
    const stride = 0;        // Auto stride
    const offset = 0;        // Start reading from index 0

    gl.vertexAttribPointer(
        locationAttributePosition,
        size,
        type,
        normalize,
        stride,
        offset
    );

    // -------------------------------------------------------------
    // 5. MATRIX
    // -------------------------------------------------------------

    // Matrix used to convert pixel space -> clip space
    let pixelMatrix = mat3.create();

    // -------------------------------------------------------------
    // 6. RENDER
    // -------------------------------------------------------------

    function render() {
        // CANVAS ------------------------
        // update canvas resolution when window resize
        resizeCanvasToDisplaySize(gl.canvas);

        // set viewport
        gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

        // BACKGROUND ------------------------
        // Clear Background
        gl.clearColor(0.32, 0.63, 0.67, 1.0); // Sckorpio-Cyan
        gl.clear(gl.COLOR_BUFFER_BIT);

        // SHADER ------------------------
        gl.useProgram(program);

        // ---------------------------------------------------------
        // PIXEL SPACE -> CLIP SPACE MATRIX
        // ---------------------------------------------------------
        const width = gl.canvas.width;
        const height = gl.canvas.height;

        /*
            Pixel -> Clip:

            x' = (2 * x / width) - 1
            y' = 1 - (2 * y / height)

            Matrix:

            |  2/w    0     -1 |
            |   0    -2/h    1 |
            |   0     0      1 |
        */

        pixelMatrix = mat3.fromValues(
            2 / width,  0,           0,
            0,         -2 / height,  0,
            -1,         1,           1
        );


        // Pass matrix to vertex shader
        gl.uniformMatrix3fv(locationUniformPixelMatrix,false,pixelMatrix);

        // BUFFER/DATA --------------------
        gl.bindVertexArray(vao);

        // DRAW CALL ------------------------
        const drawPrimitiveType = gl.TRIANGLES;
        const drawOffset = 0;
        const drawCount = 6;

        gl.drawArrays(
            drawPrimitiveType,
            drawOffset,
            drawCount
        );
    }

    // Execute first render call
    render();

    // Listen for Window resize
    window.addEventListener("resize", render);
}

// Start app once DOM content is ready
window.addEventListener("DOMContentLoaded", main);

export {
    main
};