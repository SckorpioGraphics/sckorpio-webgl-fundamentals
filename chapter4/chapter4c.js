/* #############################################################
CHAPTER 4c: Multiple Buffers

Topics:
- Using Separate Buffer for Vertex Color
- Adding a basic UI to manipulate 
- vertices positions
- vertices color
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
    in vec3 a_color;
    out vec4 v_color;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_color = vec4(a_color, 1.0);
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
    // Vertices Positions
    aX: -0.5, aY: 0.0,
    bX: 0.5,  bY: 0.0,
    cX: 0.0,  cY: 0.5,
    // Vertices Color 
    aR: 1.0 , aG: 0.0, aB: 0.0,
    bR: 0.0 , bG: 1.0, bB: 0.0,
    cR: 0.0 , cG: 0.0, cB: 1.0,
    //Uniform Color
    R: 0, G: 0, B: 0,
};

function setupGUI(render) {
    const gui = new lil.GUI();

    const verticesFolder = gui.addFolder("Vertices");

    // Point A
    const pointAFolder = verticesFolder.addFolder("Point A");
    pointAFolder.add(state, "aX", -1, 1).name("X").onChange(render);
    pointAFolder.add(state, "aY", -1, 1).name("Y").onChange(render);

    // Point B
    const pointBFolder = verticesFolder.addFolder("Point B");
    pointBFolder.add(state, "bX", -1, 1).name("X").onChange(render);
    pointBFolder.add(state, "bY", -1, 1).name("Y").onChange(render);

    // Point C
    const pointCFolder = verticesFolder.addFolder("Point C");
    pointCFolder.add(state, "cX", -1, 1).name("X").onChange(render);
    pointCFolder.add(state, "cY", -1, 1).name("Y").onChange(render);


    const colorFolder = gui.addFolder("Color");

    // Point A
    const pointAColorFolder = colorFolder.addFolder("Point A");
    pointAColorFolder.add(state, "aR", 0, 1).name("R").onChange(render);
    pointAColorFolder.add(state, "aG", 0, 1).name("G").onChange(render);
    pointAColorFolder.add(state, "aB", 0, 1).name("B").onChange(render);

    // Point B
    const pointBColorFolder = colorFolder.addFolder("Point B");
    pointBColorFolder.add(state, "bR", 0, 1).name("R").onChange(render);
    pointBColorFolder.add(state, "bG", 0, 1).name("G").onChange(render);
    pointBColorFolder.add(state, "bB", 0, 1).name("B").onChange(render);

    // Point C
    const pointCColorFolder = colorFolder.addFolder("Point C");
    pointCColorFolder.add(state, "cR", 0, 1).name("R").onChange(render);
    pointCColorFolder.add(state, "cG", 0, 1).name("G").onChange(render);
    pointCColorFolder.add(state, "cB", 0, 1).name("B").onChange(render);
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
    const locationAttributeColor = gl.getAttribLocation(program, "a_color");
    // Future Uniform etc here..
    const uniformColorPosition = gl.getUniformLocation(program, "u_color");

    // -------------------------------------------------------------
    // 3. DATA & BUFFERS
    // -------------------------------------------------------------

    // OBJECT 1
    // VERTEX POSITION BUFFER
    // create Buffer (vbo: vertex buffer object)
    var vbo_position = gl.createBuffer(); 
    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position);
    // Data will be taken from UI later...

    // VERTEX COLOR BUFFER
    // create Buffer (vbo: vertex buffer object)
    var vbo_color = gl.createBuffer(); 
    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_color);
    // Data will be taken from UI later...

    // -------------------------------------------------------------
    // 4. VERTEX ARRAY
    // -------------------------------------------------------------
    // vao: vertex array object
    var vao = gl.createVertexArray();
    // bind the vertex array
    gl.bindVertexArray(vao);
    //------vertex positions-----
    // enable that attrib
    gl.enableVertexAttribArray(locationAttributePosition);
    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position);
    // Buffer data format
    const size1 = 2;          // 2 components (X, Y) per vertex
    const type1 = gl.FLOAT;   // 32-bit float values
    const normalize1 = false; // Do not normalize
    const stride1 = 0;        // Auto stride
    const offset1 = 0;        // Start reading from index 0
    gl.vertexAttribPointer(
        locationAttributePosition,
        size1,
        type1,
        normalize1,
        stride1,
        offset1
    );
    //------vertex colors-----
    // enable that attrib
    gl.enableVertexAttribArray(locationAttributeColor);
    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_color);
    // Buffer data format
    const size2 = 3;          // 3 components (R, G, B) per vertex
    const type2 = gl.FLOAT;   // 32-bit float values
    const normalize2 = false; // Do not normalize
    const stride2 = 0;        // Auto stride
    const offset2 = 0;        // Start reading from index 0
    gl.vertexAttribPointer(
        locationAttributeColor,
        size2,
        type2,
        normalize2,
        stride2,
        offset2
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

        // Update Positions----
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position);
        // Vertex data CPU side
        const positions = new Float32Array([
            // Vertices
            state.aX, state.aY, // point A
            state.bX, state.bY, // point B
            state.cX, state.cY  // point C
        ]);
        //Feed the vertex data to buffer GPU
        gl.bufferData(
            gl.ARRAY_BUFFER, // bind point
            positions,       // cpu data
            gl.DYNAMIC_DRAW   // how frequent we gonna use it (STATIC/DYNAMIC)
        );

        // Update Positions----
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo_color);
        // Vertex data CPU side
        const colors = new Float32Array([
            // Vertices Colors
            state.aR, state.aG, state.aB, // point P
            state.bR, state.bG, state.bB, // point Q
            state.cR, state.cG, state.cB  // point R
        ]);
        //Feed the vertex data to buffer GPU
        gl.bufferData(
            gl.ARRAY_BUFFER, // bind point
            colors,       // cpu data
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