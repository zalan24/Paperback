var glCanvas = document.getElementById("c");
var gl = glCanvas.getContext("experimental-webgl");

var shaderPrograms = {};

function createProgram(vertCode, fragCode) {
  let vertShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader, vertCode);
  gl.compileShader(vertShader);
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, fragCode);
  gl.compileShader(fragShader);
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);
  return shaderProgram;
}

// TODO remove dummy stuff

let dummyVertCode =
  "attribute vec3 position;" +
  "uniform mat4 proj;" +
  "uniform mat4 view;" +
  "uniform mat4 model;" +
  "void main(void) {" +
  " vec4 pos = vec4(position, 1);" +
  " gl_Position = proj * view * model * pos;" +
  "}";
var dummyFragCode =
  "precision mediump float;" +
  "void main(void) {" +
  "gl_FragColor = vec4(0.0, 1.0, 0.0, 0.1);" +
  "}";
shaderPrograms.dummyProgram = {};
shaderPrograms.dummyProgram.shader = createProgram(
  dummyVertCode,
  dummyFragCode
);
shaderPrograms.dummyProgram.vars = {
  position: gl.getAttribLocation(
    shaderPrograms.dummyProgram.shader,
    "position"
  ),
  proj: gl.getUniformLocation(shaderPrograms.dummyProgram.shader, "proj"),
  view: gl.getUniformLocation(shaderPrograms.dummyProgram.shader, "view"),
  model: gl.getUniformLocation(shaderPrograms.dummyProgram.shader, "model")
};

var projection = null;

function startRender() {
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  // gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);

  projection = getProjection(40, glCanvas.width / glCanvas.height, 0.01, 100);
}

function endRender() {}

function renderDummy(renderData, dummyData) {
  gl.useProgram(shaderPrograms.dummyProgram.shader);
  gl.vertexAttribPointer(
    shaderPrograms.dummyProgram.vars.position,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(shaderPrograms.dummyProgram.vars.position);
  gl.uniformMatrix4fv(shaderPrograms.dummyProgram.vars.proj, false, projection);
  gl.uniformMatrix4fv(
    shaderPrograms.dummyProgram.vars.view,
    false,
    new Float32Array(renderData.view.getFloats())
  );
  gl.uniformMatrix4fv(
    shaderPrograms.dummyProgram.vars.model,
    false,
    dummyData.model.getFloats()
  );
  gl.drawElements(gl.TRIANGLES, dummyData.count, gl.UNSIGNED_SHORT, 0);
}

function updateVertexData(mesh, vertex_buffer, index_buffer) {
  let vertices = [];
  mesh.vertices.forEach(v => {
    vertices.push(v.position.x);
    vertices.push(v.position.y);
    vertices.push(v.position.z);
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  let indices = [];
  mesh.faces.forEach(f => {
    indices.push(f.a);
    indices.push(f.b);
    indices.push(f.c);
  });
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}
