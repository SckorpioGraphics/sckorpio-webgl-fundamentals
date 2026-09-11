/* #############################################################
CHAPTER 1e: Making a Geometry using triangles (F letter)
Topics:
- Letter F using Triangles
- Using Index Buffer
- Vertex Reuse
- drawElements()
###############################################################
*/


// =============================================================
// 1. GLSL Shader Sources 
// =============================================================

// NEW WebGL 2.0 Way...
// -------------------------------------------------------------
// basic vertex shader
// passing position data in clip space[-1,+1] directly
const vertexShaderSource = `#version 300 es
    in vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// basic fragment shader
// using cyan/purple color for the pixel (sckorpio branding)
const fragmentShaderSource = `#version 300 es
    precision mediump float;
    out vec4 out_Color;

    void main() {
        //out_Color = vec4(0.0, 1.0, 1.0, 1.0); //CYAN
        out_Color = vec4(0.39, 0.33, 0.58, 1.0); //PURPLE
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
    const compileStatus = gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
    );

    // if status = success : return shader
    if(compileStatus) return shader;

    // else log it
    console.error(
        "Shader Compilation Error:",
        gl.getShaderInfoLog(shader)
    );

    // and delete the shader
    gl.deleteShader(shader);
}


/**
 * Links vertex and fragment shaders into a GPU program.
 */
function createProgram(gl, vertexShader, fragmentShader) {

    // create a program
    const program = gl.createProgram();

    // attach the vertex shader to program
    gl.attachShader(program, vertexShader);

    // attach the fragment shader to program
    gl.attachShader(program, fragmentShader);

    // finally link them together
    gl.linkProgram(program);

    // get link status of program
    const linkStatus = gl.getProgramParameter(
        program,
        gl.LINK_STATUS
    );

    // if link status success
    if(linkStatus) return program;

    // else: log it
    console.error(
        "Program Linking Error:",
        gl.getProgramInfoLog(program)
    );

    // and delete the program
    gl.deleteProgram(program);
}


// =============================================================
// 2. Helper Functions
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
// 3. Main Application Entry Point
// =============================================================

function main() {

    // -------------------------------------------------------------
    // 1. WEBGL CANVAS 
    // -------------------------------------------------------------

    // Get the Canvas
    const canvas = document.querySelector("#c");

    if(!canvas) {
        console.error("Canvas element not found");
        return;
    }

    // Get the WebGL context
    const gl = canvas.getContext("webgl2");

    if(!gl) {
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
    // Future Uniform etc here..


    // -------------------------------------------------------------
    // 3. DATA & BUFFERS
    // -------------------------------------------------------------
    // OBJECT 1

    /*
        2--------3----------4
        |\       |\         |
        |\       |   \      |
        | \      |      \   |
        | \      6_________\5
        |  \     |      
        |   \    7_______8
        |   \    |  \    |
        |    \   |    \  |
        |    \   10_____\9
        |     \  |
        |     \  |
        |      \ |
        0_______\1



    */
   
    // -------------------------------------------------------------
    // VERTEX BUFFER
    // -------------------------------------------------------------

    // create Buffer (vbo: vertex buffer object)
    var vbo = gl.createBuffer();

    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);


    const positions = new Float32Array([

        // Left column
        -0.4, -0.6,   // 0
        -0.2, -0.6,   // 1
        -0.4,  0.6,   // 2
        -0.2,  0.6,   // 3

        // Top bar
        0.2,  0.6,    // 4
        0.2,  0.4,    // 5
        -0.4, 0.4,     // 6

        // Middle bar
        -0.4, 0.2,   // 7
        0.1,  0.2,   // 8
        0.1,  0.0,    // 9
        -0.4, 0.0    // 10

    ]);


    // Feed the vertex data to buffer GPU
    gl.bufferData(
        gl.ARRAY_BUFFER, // bind point
        positions,       // CPU data
        gl.STATIC_DRAW   // how frequently we use it
    );


    // -------------------------------------------------------------
    // INDEX BUFFER
    // -------------------------------------------------------------

    // Create index buffer
    var ibo = gl.createBuffer();

    // Bind index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);


    // Index data CPU side
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


    // Feed index data to buffer GPU
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER, // bind point
        indices,                  // CPU index data
        gl.STATIC_DRAW            // how frequently we use it
    );


    // -------------------------------------------------------------
    // 4. VERTEX ARRAY
    // -------------------------------------------------------------

    // vao: vertex array object
    var vao = gl.createVertexArray();

    // bind the vertex array
    gl.bindVertexArray(vao);

    // enable that attrib
    gl.enableVertexAttribArray(
        locationAttributePosition
    );

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


    // IMPORTANT:
    // Index buffer binding is stored inside the VAO.
    gl.bindBuffer(
        gl.ELEMENT_ARRAY_BUFFER,
        ibo
    );


    // -------------------------------------------------------------
    // 5. RENDER (this will happen every frame)
    // -------------------------------------------------------------

    function render() {

        // CANVAS------------------------

        // update canvas resolution when window resize
        resizeCanvasToDisplaySize(gl.canvas);

        // set view port
        gl.viewport(
            0,
            0,
            gl.canvas.width,
            gl.canvas.height
        );


        // BACKGROUND------------------------

        // Clear Background
        gl.clearColor(
            0.0,
            1.0,
            1.0,
            1.0
        );

        // Clear BG
        gl.clear(gl.COLOR_BUFFER_BIT);


        // SHADER------------------------

        gl.useProgram(program);


        // BUFFER/DATA--------------------

        // Simply using Vertex Array
        gl.bindVertexArray(vao);


        // DRAW CALL------------------------

        const draw_primitiveType = gl.TRIANGLES;

        // Number of indices to process
        const draw_count = indices.length;

        // Data type of each index
        const draw_type = gl.UNSIGNED_SHORT;

        // Byte offset into index buffer
        const draw_offset = 0;


        gl.drawElements(
            draw_primitiveType,
            draw_count,
            draw_type,
            draw_offset
        );
    }


    // Execute first render call
    render();

    // Listen for Window resize
    // when window gets resized ... render again
    window.addEventListener(
        "resize",
        render
    );
}


// Start app once DOM content is ready
window.addEventListener(
    "DOMContentLoaded",
    main
);


export {
    main
};