/* #############################################################
CHAPTER 6e: All types of Uniforms 

Topics:
- Just showing all types of Uniforms passing ways
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

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// basic fragment shader
// using cyan/purple color for the pixel (sckorpio branding)
const fragmentShaderSource = `#version 300 es
    precision mediump float;
    out vec4 out_Color;
    
    uniform vec3 u_color;
    uniform float u_intensity;

    void main() {
        out_Color = vec4(u_color, 1.0) * u_intensity; //Sckorpio-Purple
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
    // Color
    R: 0.39 , G: 0.33, B: 0.58,
    // Intensity
    intensity: 1.0,

};

function setupGUI(render) {

    const gui = new lil.GUI();

    const uniformFolder = gui.addFolder("Uniforms");

    const colorFolder = uniformFolder.addFolder("Color");
    colorFolder.add(state, "R", 0, 1).name("R").onChange(render);
    colorFolder.add(state, "G", 0, 1).name("G").onChange(render);
    colorFolder.add(state, "B", 0, 1).name("B").onChange(render);

    // intensity
    const intensityFolder = uniformFolder.addFolder("intensity");
    intensityFolder.add(state, "intensity", 0, 1).name("intensity").onChange(render);
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
    const locationUniformIntensity = gl.getUniformLocation(program, "u_intensity");
    const locationUniformColor = gl.getUniformLocation(program, "u_color");

    // MORE WAYS OF PASSING DATA TO SHADER


    // -------------------------------------------------------------
    // 3. DATA & BUFFERS
    // -------------------------------------------------------------

    // OBJECT 1
    // VERTEX BUFFER
    // create Buffer (vbo: vertex buffer object)
    var vbo = gl.createBuffer(); 
    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // Vertex data CPU side
    const positions = new Float32Array([
        -0.5, 0.0, // point 1
        0.0, 0.5,  // point 2
        0.5, 0.0   // point 3
    ]);
    //Feed the vertex data to buffer GPU
    gl.bufferData(
        gl.ARRAY_BUFFER, // bind point
        positions,       // cpu data
        gl.DYNAMIC_DRAW   // how frequent we gonna use it (STATIC/DYNAMIC)
    );

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
        // Set the color from UI values
        //gl.uniform3f(locationUniformColor, state.R, state.G, state.B);
        gl.uniform3fv(locationUniformColor, [state.R, state.G, state.B]);
        // Set the intesnity from UI values
        gl.uniform1f(locationUniformIntensity, state.intensity);

        // MORE WAYS OF PASSING UNIFORMS!!!!
        /*
        gl.uniform1f (floatUniformLoc, v);                 // for float
        gl.uniform1fv(floatUniformLoc, [v]);               // for float or float array
        gl.uniform2f (vec2UniformLoc,  v0, v1);            // for vec2
        gl.uniform2fv(vec2UniformLoc,  [v0, v1]);          // for vec2 or vec2 array
        gl.uniform3f (vec3UniformLoc,  v0, v1, v2);        // for vec3
        gl.uniform3fv(vec3UniformLoc,  [v0, v1, v2]);      // for vec3 or vec3 array
        gl.uniform4f (vec4UniformLoc,  v0, v1, v2, v4);    // for vec4
        gl.uniform4fv(vec4UniformLoc,  [v0, v1, v2, v4]);  // for vec4 or vec4 array
        
        gl.uniformMatrix2fv(mat2UniformLoc, false, [  4x element array ])  // for mat2 or mat2 array
        gl.uniformMatrix3fv(mat3UniformLoc, false, [  9x element array ])  // for mat3 or mat3 array
        gl.uniformMatrix4fv(mat4UniformLoc, false, [ 16x element array ])  // for mat4 or mat4 array
        
        gl.uniform1i (intUniformLoc,   v);                 // for int
        gl.uniform1iv(intUniformLoc, [v]);                 // for int or int array
        gl.uniform2i (ivec2UniformLoc, v0, v1);            // for ivec2
        gl.uniform2iv(ivec2UniformLoc, [v0, v1]);          // for ivec2 or ivec2 array
        gl.uniform3i (ivec3UniformLoc, v0, v1, v2);        // for ivec3
        gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);      // for ivec3 or ivec3 array
        gl.uniform4i (ivec4UniformLoc, v0, v1, v2, v4);    // for ivec4
        gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v4]);  // for ivec4 or ivec4 array
        
        gl.uniform1u (intUniformLoc,   v);                 // for uint
        gl.uniform1uv(intUniformLoc, [v]);                 // for uint or uint array
        gl.uniform2u (ivec2UniformLoc, v0, v1);            // for uvec2
        gl.uniform2uv(ivec2UniformLoc, [v0, v1]);          // for uvec2 or uvec2 array
        gl.uniform3u (ivec3UniformLoc, v0, v1, v2);        // for uvec3
        gl.uniform3uv(ivec3UniformLoc, [v0, v1, v2]);      // for uvec3 or uvec3 array
        gl.uniform4u (ivec4UniformLoc, v0, v1, v2, v4);    // for uvec4
        gl.uniform4uv(ivec4UniformLoc, [v0, v1, v2, v4]);  // for uvec4 or uvec4 array
        
        // for sampler2D, sampler3D, samplerCube, samplerCubeShadow, sampler2DShadow,
        // sampler2DArray, sampler2DArrayShadow
        gl.uniform1i (samplerUniformLoc,   v);
        gl.uniform1iv(samplerUniformLoc, [v]);

        */

        // BUFFER/DATA--------------------
        // bY simply using Vertex Array
        gl.bindVertexArray(vao);


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