/* #############################################################
   CHAPTER 14d: 2D Transformations — Rotation Around a Pivot
   Topics:
   - Rotating a letterF around a pivot
   - Pivot position
   - Translation to and from the pivot
   - Visualizing the pivot
   #############################################################
*/


// =============================================================
// GLOBAL DATA
// =============================================================

// =============================================================
// SHADER
// =============================================================
const shader = {
    vertexShaderSource: `#version 300 es
    in vec2 a_position;

    uniform mat3 u_viewMatrix;
    uniform mat3 u_projectionMatrix;

    uniform float u_translationX;
    uniform float u_translationY;
    uniform float u_rotation;
    uniform float u_pivotX;
    uniform float u_pivotY;

    void main() {

        vec3 localPosition = vec3(a_position, 1.0);

        // Translate to pivot
        mat3 translateToPivot = mat3(
            1.0,       0.0,       0.0,
            0.0,       1.0,       0.0,
            -u_pivotX, -u_pivotY, 1.0
        );

        // Rotation
        mat3 rotationMatrix = mat3(
            cos(radians(u_rotation)),  sin(radians(u_rotation)), 0.0,
           -sin(radians(u_rotation)),  cos(radians(u_rotation)), 0.0,
            0.0,                       0.0,                      1.0
        );

        // Translate back from pivot
        mat3 translateBack = mat3(
            1.0,       0.0,       0.0,
            0.0,       1.0,       0.0,
            u_pivotX,  u_pivotY,  1.0
        );

        // Translation
        mat3 translationMatrix = mat3(
            1.0,            0.0,            0.0,
            0.0,            1.0,            0.0,
            u_translationX, u_translationY, 1.0
        );

        vec3 worldPosition =
            translationMatrix *
            translateBack *
            rotationMatrix *
            translateToPivot *
            localPosition;

        vec3 viewPosition = u_viewMatrix * worldPosition;
        vec3 clipPosition = u_projectionMatrix * viewPosition;

        gl_Position = vec4(clipPosition.xy, 0.0, 1.0);
    }
`,

    fragmentShaderSource: `#version 300 es
    precision mediump float;

    uniform vec4 u_color;

    out vec4 out_color;

    void main() {
        out_color = u_color;
    }
`,

    program: null,

    attributes: {
        position: null
    },

    uniforms: {
        translationX: null,
        translationY: null,
        rotation: null,
        pivotX: null,
        pivotY: null,
        viewMatrix: null,
        projectionMatrix: null,
        color: null
    },

    init(gl) {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource);
        this.program = createProgram(gl, vertexShader, fragmentShader);

        this.attributes.position = gl.getAttribLocation(this.program, "a_position");
        this.uniforms.translationX = gl.getUniformLocation(this.program, "u_translationX");
        this.uniforms.translationY = gl.getUniformLocation(this.program, "u_translationY");
        this.uniforms.rotation = gl.getUniformLocation(this.program, "u_rotation");
        this.uniforms.pivotX = gl.getUniformLocation(this.program, "u_pivotX");
        this.uniforms.pivotY = gl.getUniformLocation(this.program, "u_pivotY");
        this.uniforms.viewMatrix = gl.getUniformLocation(this.program, "u_viewMatrix");
        this.uniforms.projectionMatrix = gl.getUniformLocation(this.program, "u_projectionMatrix");
        this.uniforms.color = gl.getUniformLocation(this.program, "u_color");
    }
};

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    const compileStatus =
        gl.getShaderParameter(
            shader,
            gl.COMPILE_STATUS
        );

    if(compileStatus)
        return shader;

    console.error(
        "Shader Compilation Error:",
        gl.getShaderInfoLog(shader)
    );

    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const linkStatus =gl.getProgramParameter(program,gl.LINK_STATUS);

    if(linkStatus)
        return program;
    console.error("Program Linking Error:",gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

// =============================================================
// CAMERA
// =============================================================

const camera = {

    width: 0,
    height: 0,

    positionX: -300,
    positionY: -200,

    zoom: 1.0,

    panSpeed: 10,
    zoomSpeed: 0.1,

    state: {
        panUp: false,
        panDown: false,
        panLeft: false,
        panRight: false,
        zoomIn: false,
        zoomOut: false
    },

    viewMatrix: mat3.create(),
    projectionMatrix: mat3.create(),

    update(gl) {
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;
        if(this.state.panUp) this.positionY += this.panSpeed;
        if(this.state.panDown) this.positionY -= this.panSpeed;
        if(this.state.panLeft) this.positionX -= this.panSpeed;
        if(this.state.panRight) this.positionX += this.panSpeed;
        if(this.state.zoomIn) this.zoom += this.zoomSpeed;
        if(this.state.zoomOut) this.zoom = Math.max(0.1,this.zoom - this.zoomSpeed);
    },

    updateViewMatrix() {
        const matrix = mat3.create();
        mat3.fromTranslation(matrix,[-this.positionX, -this.positionY]);
        mat3.scale(matrix,matrix,[this.zoom, this.zoom]);
        this.viewMatrix = matrix;
    },

    updateProjectionMatrix(gl) {
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;
        this.projectionMatrix = mat3.fromValues(
            2 / this.width,  0,                 0,
            0,               2 / this.height,  0,
            -1,              -1,                1
        );
    }
};


// =============================================================
// SCENE OBJECTS
// =============================================================
const grid = {
    shader: null,

    vao: null,
    vbo: null,

    drawMode: null,
    drawOffset: 0,
    drawCount: 0,

    init(gl, shader) {

        this.shader = shader;

        const positions = [];
        const spacing = 100;
        const range = 10000;

        for(let x = -range; x <= range; x += spacing) {
            positions.push(x, -range, x, range);
        }

        for(let y = -range; y <= range; y += spacing) {
            positions.push(-range, y, range, y);
        }

        this.vbo = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW
        );

        this.vao = gl.createVertexArray();

        gl.bindVertexArray(this.vao);

        gl.enableVertexAttribArray(
            this.shader.attributes.position
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        gl.vertexAttribPointer(
            this.shader.attributes.position,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        this.drawMode = gl.LINES;
        this.drawOffset = 0;
        this.drawCount = positions.length / 2;
    }
};

const xAxis = {

    shader: null,

    vao: null,
    vbo: null,

    drawMode: null,
    drawOffset: 0,
    drawCount: 0,

    init(gl, shader) {

        this.shader = shader;

        const positions = new Float32Array([
            -10000, 0,
             10000, 0
        ]);

        this.vbo = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            positions,
            gl.STATIC_DRAW
        );

        this.vao = gl.createVertexArray();

        gl.bindVertexArray(this.vao);

        gl.enableVertexAttribArray(
            this.shader.attributes.position
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        gl.vertexAttribPointer(
            this.shader.attributes.position,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        this.drawMode = gl.LINES;
        this.drawOffset = 0;
        this.drawCount = 2;
    }
};


const yAxis = {

    shader: null,

    vao: null,
    vbo: null,

    drawMode: null,
    drawOffset: 0,
    drawCount: 0,

    init(gl, shader) {

        this.shader = shader;

        const positions = new Float32Array([
            0, -10000,
            0,  10000
        ]);

        this.vbo = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            positions,
            gl.STATIC_DRAW
        );

        this.vao = gl.createVertexArray();

        gl.bindVertexArray(this.vao);

        gl.enableVertexAttribArray(
            this.shader.attributes.position
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        gl.vertexAttribPointer(
            this.shader.attributes.position,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        this.drawMode = gl.LINES;
        this.drawOffset = 0;
        this.drawCount = 2;
    }
};


const letterF = {

    shader: null,

    vao: null,
    vbo: null,
    ibo: null,

    drawMode: null,
    drawOffset: 0,
    drawCount: 0,
    drawType: null,

    positionX: 300,
    positionY: 200,

    rotation: 0,

    pivotX: 0,
    pivotY: 0,

    init(gl, shader) {

        this.shader = shader;

        const positions = new Float32Array([

            // Left column
            -100, -100,
             -60, -100,
            -100,  100,
             -60,  100,

            // Top bar
             40,  100,
             40,   60,
            -100,   60,

            // Middle bar
            -100,  20,
               0,  20,
               0, -20,
            -100, -20
        ]);

        this.vbo = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            positions,
            gl.STATIC_DRAW
        );

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

        this.ibo = gl.createBuffer();

        gl.bindBuffer(
            gl.ELEMENT_ARRAY_BUFFER,
            this.ibo
        );

        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            indices,
            gl.STATIC_DRAW
        );

        this.vao = gl.createVertexArray();

        gl.bindVertexArray(this.vao);

        gl.enableVertexAttribArray(
            this.shader.attributes.position
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        gl.vertexAttribPointer(
            this.shader.attributes.position,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        gl.bindBuffer(
            gl.ELEMENT_ARRAY_BUFFER,
            this.ibo
        );

        this.drawMode = gl.TRIANGLES;
        this.drawOffset = 0;
        this.drawCount = indices.length;
        this.drawType = gl.UNSIGNED_SHORT;
    }
};

const pivot = {

    shader: null,

    vao: null,
    vbo: null,

    drawMode: null,
    drawOffset: 0,
    drawCount: 0,

    init(gl, shader) {

        this.shader = shader;

        const size = 10;

        const positions = new Float32Array([
            -size, 0,
             size, 0,
             0, -size,
             0,  size
        ]);

        this.vbo = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            positions,
            gl.STATIC_DRAW
        );

        this.vao = gl.createVertexArray();

        gl.bindVertexArray(this.vao);

        gl.enableVertexAttribArray(
            this.shader.attributes.position
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        gl.vertexAttribPointer(
            this.shader.attributes.position,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        this.drawMode = gl.LINES;
        this.drawOffset = 0;
        this.drawCount = 4;
    }
};


// =============================================================
// HELPER FUNCTIONS
// =============================================================
function resizeCanvasToDisplaySize(
    canvas,
    multiplier = 1
) {

    const width =
        (canvas.clientWidth * multiplier) | 0;

    const height =
        (canvas.clientHeight * multiplier) | 0;

    if(
        canvas.width !== width ||
        canvas.height !== height
    ) {

        canvas.width = width;
        canvas.height = height;

        return true;
    }

    return false;
}

// =============================================================
// GUI Setup Functions
// =============================================================
function setupGUI() {
    const gui = new lil.GUI();

    const cameraFolder = gui.addFolder("Camera");
    cameraFolder.add(camera.state, "panUp").name("↑ Up");
    cameraFolder.add(camera.state, "panLeft").name("← Left");
    cameraFolder.add(camera.state, "panDown").name("↓ Down");
    cameraFolder.add(camera.state, "panRight").name("→ Right");
    cameraFolder.add(camera.state, "zoomIn").name("Zoom In");
    cameraFolder.add(camera.state, "zoomOut").name("Zoom Out");

    const letterFFolder = gui.addFolder("LetterF");
    letterFFolder.add(letterF, "positionX", -1000, 1000).name("positionX");
    letterFFolder.add(letterF, "positionY", -1000, 1000).name("positionY");
    letterFFolder.add(letterF, "rotation", 0, 360).name("rotation");
    letterFFolder.add(letterF, "pivotX", -100, 100).name("pivotX");
    letterFFolder.add(letterF, "pivotY", -100, 100).name("pivotY");
}


// =============================================================
// Input / Event Functions
// =============================================================

const keyEvent = {

    init() {

        window.addEventListener("keydown", event => {

            switch(event.key) {

                case "ArrowUp":
                    camera.state.panUp = true;
                    break;

                case "ArrowLeft":
                    camera.state.panLeft = true;
                    break;

                case "ArrowDown":
                    camera.state.panDown = true;
                    break;

                case "ArrowRight":
                    camera.state.panRight = true;
                    break;

                case "I":
                case "i":
                    camera.state.zoomIn = true;
                    break;

                case "O":
                case "o":
                    camera.state.zoomOut = true;
                    break;
            }
        });


        window.addEventListener("keyup", event => {

            switch(event.key) {

                case "ArrowUp":
                    camera.state.panUp = false;
                    break;

                case "ArrowLeft":
                    camera.state.panLeft = false;
                    break;

                case "ArrowDown":
                    camera.state.panDown = false;
                    break;

                case "ArrowRight":
                    camera.state.panRight = false;
                    break;

                case "I":
                case "i":
                    camera.state.zoomIn = false;
                    break;

                case "O":
                case "o":
                    camera.state.zoomOut = false;
                    break;
            }
        });
    }
};


// =============================================================
// RENDER
// =============================================================

function render(gl) {
    camera.update(gl);
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    gl.clearColor(0.32,0.63,0.67,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(shader.program);

    // PROJECTION MATRIX
    camera.updateProjectionMatrix(gl);
    gl.uniformMatrix3fv(shader.uniforms.projectionMatrix,false,camera.projectionMatrix);

    // VIEW MATRIX
    camera.updateViewMatrix();
    gl.uniformMatrix3fv(shader.uniforms.viewMatrix,false,camera.viewMatrix);


    // GRID
    gl.bindVertexArray(grid.vao);
    gl.uniform1f(shader.uniforms.translationX, 0);
    gl.uniform1f(shader.uniforms.translationY, 0);
    gl.uniform1f(shader.uniforms.rotation, 0);
    gl.uniform1f(shader.uniforms.pivotX, 0);
    gl.uniform1f(shader.uniforms.pivotY, 0);
    gl.uniform4f(shader.uniforms.color,0.39,0.33,0.58,1.0);
    gl.drawArrays(grid.drawMode,grid.drawOffset,grid.drawCount);

    // X AXIS
    gl.bindVertexArray(xAxis.vao);
    gl.uniform1f(shader.uniforms.translationX, 0);
    gl.uniform1f(shader.uniforms.translationY, 0);
    gl.uniform1f(shader.uniforms.rotation, 0);
    gl.uniform1f(shader.uniforms.pivotX, 0);
    gl.uniform1f(shader.uniforms.pivotY, 0);
    gl.uniform4f(shader.uniforms.color,1.0,0.0,0.0,1.0);
    gl.drawArrays(xAxis.drawMode,xAxis.drawOffset,xAxis.drawCount);

    // Y AXIS
    gl.bindVertexArray(yAxis.vao);
    gl.uniform1f(shader.uniforms.translationX, 0);
    gl.uniform1f(shader.uniforms.translationY, 0);
    gl.uniform1f(shader.uniforms.rotation, 0);
    gl.uniform1f(shader.uniforms.pivotX, 0);
    gl.uniform1f(shader.uniforms.pivotY, 0);
    gl.uniform4f(shader.uniforms.color,0.0,1.0,0.0,1.0);
    gl.drawArrays(yAxis.drawMode,yAxis.drawOffset,yAxis.drawCount);

    // LETTER-F
    gl.bindVertexArray(letterF.vao);
    gl.uniform1f(shader.uniforms.translationX,letterF.positionX);
    gl.uniform1f(shader.uniforms.translationY,letterF.positionY);
    gl.uniform1f(shader.uniforms.rotation,letterF.rotation);
    gl.uniform1f(shader.uniforms.pivotX,letterF.pivotX);
    gl.uniform1f(shader.uniforms.pivotY,letterF.pivotY);
    gl.uniform4f(shader.uniforms.color,0.39,0.33,0.58,1.0);
    gl.drawElements(
        letterF.drawMode,
        letterF.drawCount,
        letterF.drawType,
        letterF.drawOffset
    );

    // PIVOT
    gl.bindVertexArray(pivot.vao);
    gl.uniform1f(shader.uniforms.translationX,letterF.positionX + letterF.pivotX);
    gl.uniform1f(shader.uniforms.translationY,letterF.positionY + letterF.pivotY);
    gl.uniform1f(shader.uniforms.rotation, 0);
    gl.uniform1f(shader.uniforms.pivotX, 0);
    gl.uniform1f(shader.uniforms.pivotY, 0);
    gl.uniform4f(shader.uniforms.color,1.0,1.0,1.0,1.0);
    gl.drawArrays(pivot.drawMode,pivot.drawOffset,pivot.drawCount);

    requestAnimationFrame(() => render(gl));
}


// =============================================================
// MAIN
// =============================================================

function main() {

    const canvas = document.querySelector("#c");

    if(!canvas) {
        console.error(
            "Canvas element not found"
        );
        return;
    }

    const gl = canvas.getContext("webgl2");

    if(!gl) {
        console.error(
            "WebGL2 is not supported by this browser"
        );
        return;
    }

    shader.init(gl);
    grid.init(gl, shader);
    xAxis.init(gl, shader);
    yAxis.init(gl, shader);
    letterF.init(gl, shader);
    pivot.init(gl, shader);

    setupGUI();

    keyEvent.init();

    render(gl);
}


// =============================================================
// STARTUP AND EXPORTS
// =============================================================

window.addEventListener(
    "DOMContentLoaded",
    main
);

export {
    main
};