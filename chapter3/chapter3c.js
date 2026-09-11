/* #############################################################
CHAPTER 3c: Varying

Topics:
- Using Vertex data itself for Vertex Color
- Adding a basic UI to manipulate 
- vertices positions
###############################################################
*/


// =============================================================
// 1. GLSL Shader Sources 
// =============================================================

// NEW WebGL 2.0 Way...
// -------------------------------------------------------------
// basic vertex shader
// passing postion data in clip space[-1,+1] directly
const vertexShaderSource =  `#version 300 es
    in vec2 a_position;
    out vec4 v_color;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_color = gl_Position * 0.5 + 0.5; // To make them non negative [-1,+1] -> [0,1]
    }
`;

// basic fragment shader
// using cyan/purple color for the pixel (sckorpio branding)
const fragmentShaderSource = `#version 300 es
    precision highp float;
    in vec4 v_color;
    out vec4 out_color;

    void main() {
        out_color = v_color;
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
    if(compileStatus) return shader;
    // else log it
    console.error("Shader Compilation Error:", gl.getShaderInfoLog(shader));
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
    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
    // if link status success
    if(linkStatus) return program;

    // else: log it
    console.error("Program Linking Error:", gl.getProgramInfoLog(program));
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
// 0. GUI using.. lil-gui
// =============================================================

var state = {
    // Vertices
    aX: -0.5, aY: 0.0,
    bX: 0.5,  bY: 0.0,
    cX: 0.0,  cY: 0.5,
};

function setupGUI(render) {
    const gui = new lil.GUI();
    const vertexFolder = gui.addFolder("Vertex Positions");

    // Point A
    const pointAFolder = vertexFolder.addFolder("Point A");
    pointAFolder.add(state, "aX", -1, 1).name("X").onChange(render);
    pointAFolder.add(state, "aY", -1, 1).name("Y").onChange(render);

    // Point B
    const pointBFolder = vertexFolder.addFolder("Point B");
    pointBFolder.add(state, "bX", -1, 1).name("X").onChange(render);
    pointBFolder.add(state, "bY", -1, 1).name("Y").onChange(render);

    // Point C
    const pointCFolder = vertexFolder.addFolder("Point C");
    pointCFolder.add(state, "cX", -1, 1).name("X").onChange(render);
    pointCFolder.add(state, "cY", -1, 1).name("Y").onChange(render);
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

    // UI setup
    setupGUI(render);

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
    const uniformColorPosition = gl.getUniformLocation(program, "u_color");

    // -------------------------------------------------------------
    // 3. DATA & BUFFERS
    // -------------------------------------------------------------

    // OBJECT 1
    // VERTEX BUFFER
    // create Buffer (vbo: vertex buffer object)
    var vbo = gl.createBuffer(); 
    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // Data will be taken from UI later...

    // -------------------------------------------------------------
    // 4. VERTEX ARRAY
    // -------------------------------------------------------------
    // vao: vertex array object
    var vao = gl.createVertexArray();
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
    // 5. RENDER (this will happen every frame)
    // -------------------------------------------------------------
    function render() {
        // CANVAS------------------------
        // update canvas resolution when window resize
        resizeCanvasToDisplaySize(gl.canvas);
        // set view port
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // BACKGROUND------------------------
        // Clear Background Pick clear color
        gl.clearColor(0.0, 1.0, 1.0, 1.0);
        // Clear BG (here we can also clear depth etc)
        gl.clear(gl.COLOR_BUFFER_BIT);

        // SHADER------------------------
        gl.useProgram(program);
        // Set the color from UI values
        gl.uniform4f(uniformColorPosition, state.R, state.G, state.B, 1);


        // BUFFER/DATA--------------------
        // bY simply using Vertex Array
        gl.bindVertexArray(vao);

        // Vertex data CPU side
        const positions = new Float32Array([
            // Vertices
            state.aX, state.aY, // point 1
            state.bX, state.bY, // point 2
            state.cX, state.cY  // point 3
        ]);
        //Feed the vertex data to buffer GPU
        gl.bufferData(
            gl.ARRAY_BUFFER, // bind point
            positions,       // cpu data
            gl.DYNAMIC_DRAW   // how frequent we gonna use it (STATIC/DYNAMIC)
        );

        //DRAW CALL------------------------
        const draw_primitiveType = gl.TRIANGLES;
        const draw_offset = 0;
        const draw_count = 3;
        gl.drawArrays(draw_primitiveType, draw_offset, draw_count);
    }

    // Execute first render call
    render();

    // Listen for Window resize
    // when window get resized ... we render again
    window.addEventListener("resize", render);
}

// Start app once DOM content is ready
window.addEventListener("DOMContentLoaded", main);

export {
    main
};