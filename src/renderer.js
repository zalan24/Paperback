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
  "attribute vec3 coordinates;" +
  "void main(void) {" +
  " gl_Position = vec4(coordinates, 1.0);" +
  "}";
var dummyFragCode =
  "void main(void) {" + "gl_FragColor = vec4(0.0, 1.0, 0.0, 0.1);" + "}";
shaderPrograms.dummyProgram = {};
shaderPrograms.dummyProgram.shader = createProgram(
  dummyVertCode,
  dummyFragCode
);
shaderPrograms.dummyProgram.vars = {
  coordinates: gl.getAttribLocation(
    shaderPrograms.dummyProgram.shader,
    "coordinates"
  )
};
gl.vertexAttribPointer(
  shaderPrograms.dummyProgram.vars.coordinates,
  3,
  gl.FLOAT,
  false,
  0,
  0
);

function startRender() {
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);
}

function endRender() {}

function renderDummy(renderData, dummyData) {
  gl.useProgram(shaderPrograms.dummyProgram.shader);
  gl.enableVertexAttribArray(shaderPrograms.dummyProgram.vars.coordinates);
  // gl.drawArrays(gl.TRIANGLES, 0, 3);
}
