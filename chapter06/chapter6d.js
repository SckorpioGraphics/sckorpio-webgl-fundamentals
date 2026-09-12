/* #############################################################
CHAPTER 6d: 
- Creating a a lot of Random Basic Rectangle
- Vertex Data In Pixel space
- Inverted Y coordinate

Topics:
- Uniforms ( for scrren space data)
- Pixel space to Clip space math 
- Inverted Y coordinates
- Reusing the same buffer for creating mutlipe rectangles
- RequestAnimationFrame() for renderloop
###############################################################
*/

// =============================================================
// 1. GLSL Shader Sources 
// =============================================================

// OLD WebGL 1.0 Way...
// -------------------------------------------------------------
// basic vertex shader
// passing postion data in clip space[-1,+1] directly
const vertexShaderSourceOld =  `
    attribute vec2 a_position;
    uniform vec2 u_resolution;

    void main() {
        // pixel to [0,1]
        vec2 zeroToOne = a_position / u_resolution;

        // [-1,1] to [0,2]
        vec2 zeroToTwo = zeroToOne * 2.0;

        // [0,2] to [-1,1]
        vec2 clipSpace = zeroToTwo - 1.0;

        // Inver vertical (TopLeft corner= (0,0))
        vec2 clipSpaceInverted = clipSpace * vec2(1.0,-1.0);

        gl_Position = vec4(clipSpaceInverted, 0.0, 1.0);
    }
`;

// basic fragment shader
// using cyan/purple color for the pixel (sckorpio branding)
const fragmentShaderSourceOld = `
    precision mediump float;

    void main() {
        //gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0); //CYAN
        gl_FragColor = vec4(0.39, 0.33, 0.58, 1.0); //Sckorpio-Purple
    }
`;

// NEW WebGL 2.0 Way...
// -------------------------------------------------------------
// basic vertex shader
// passing postion data in clip space[-1,+1] directly
const vertexShaderSource =  `#version 300 es
    in vec2 a_position;
    uniform vec2 u_resolution;

    void main() {
        // pixel to [0,1]
        vec2 zeroToOne = a_position / u_resolution;

        // [-1,1] to [0,2]
        vec2 zeroToTwo = zeroToOne * 2.0;

        // [0,2] to [-1,1]
        vec2 clipSpace = zeroToTwo - 1.0;

        // Inver vertical (TopLeft corner= (0,0))
        vec2 clipSpaceInverted = clipSpace * vec2(1.0,-1.0);

        gl_Position = vec4(clipSpaceInverted, 0.0, 1.0);
    }
`;

// basic fragment shader
// using cyan/purple color for the pixel (sckorpio branding)
const fragmentShaderSource = `#version 300 es
    precision mediump float;
    out vec4 out_color;
    uniform vec4 u_color; 

    void main() {
        //out_Color = vec4(0.0, 1.0, 1.0, 1.0); //CYAN
        //out_Color = vec4(0.39, 0.33, 0.58, 1.0); //Sckorpio-Purple
        out_color = u_color;
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

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
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
    // Save Uniform locations
    const locationUniformResolution = gl.getUniformLocation(program, "u_resolution");
    const locationUniformColor = gl.getUniformLocation(program, "u_color");

    // -------------------------------------------------------------
    // 3. DATA & BUFFERS
    // -------------------------------------------------------------
    // OBJECT 1
    // VERTEX BUFFER
    // create Buffer
    var vbo = gl.createBuffer();
    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // PASS NO DATA FOR NOW

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
        gl.clearColor(0.32, 0.63, 0.67, 1.0);  //Sckorpio-Cyan
        // Clear BG (here we can also clear depth etc)
        gl.clear(gl.COLOR_BUFFER_BIT);

        // SHADER------------------------
        gl.useProgram(program);
        // Pass dynamic canvas resolution to vertex shader uniform
        gl.uniform2f(locationUniformResolution, gl.canvas.width, gl.canvas.height);

        // BUFFER/DATA--------------------
        // bY simply using Vertex Array
        gl.bindVertexArray(vao);
        // bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

         //DRAW CALL------------------------
        // draw 50 random rectangles in random colors
        for (var ii = 0; ii < 50; ++ii) {
            // Put a rectangle in the position buffer
            setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

            // Set a random color.
            gl.uniform4f(locationUniformColor, Math.random(), Math.random(), Math.random(), 1);

            // Draw the rectangle.
            const draw_primitiveType = gl.TRIANGLES;
            const draw_offset = 0;
            const draw_count = 6;
            gl.drawArrays(draw_primitiveType, draw_offset, draw_count);
        }

        // Request next animation frame
        requestAnimationFrame(render);
    }

    // Request next animation frame
    requestAnimationFrame(render);

    // Listen for Window resize
    // when window get resized ... we render again
    window.addEventListener("resize", render);
}

// Start app once DOM content is ready
window.addEventListener("DOMContentLoaded", main);

export {
    main
};