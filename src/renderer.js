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
  "attribute vec2 texcoord;" +
  "uniform mat4 proj;" +
  "uniform mat4 view;" +
  "uniform mat4 model;" +
  "varying highp vec2 texc;" +
  "void main(void) {" +
  " vec4 pos = vec4(position, 1);" +
  " gl_Position = proj * view * model * pos;" +
  " texc = texcoord;" +
  "}";
var dummyFragCode =
  "precision mediump float;" +
  "varying highp vec2 texc;" +
  "uniform sampler2D texture;" +
  "void main(void) {" +
  "  vec4 albedo = texture2D(texture, texc);" +
  "  if (albedo.a == 0.0) discard;" +
  "  gl_FragColor = albedo;" +
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
  texcoord: gl.getAttribLocation(
    shaderPrograms.dummyProgram.shader,
    "texcoord"
  ),
  texture: gl.getUniformLocation(shaderPrograms.dummyProgram.shader, "texture"),
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
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);

  projection = getProjection(40, glCanvas.width / glCanvas.height, 0.01, 100);
}

function endRender() {}

function renderDummy(renderData, dummyData) {
  gl.useProgram(shaderPrograms.dummyProgram.shader);
  let stride = 5 * 4;
  gl.enableVertexAttribArray(shaderPrograms.dummyProgram.vars.position);
  gl.vertexAttribPointer(
    shaderPrograms.dummyProgram.vars.position,
    3,
    gl.FLOAT,
    false,
    stride,
    0
  );
  gl.enableVertexAttribArray(shaderPrograms.dummyProgram.vars.texcoord);
  gl.vertexAttribPointer(
    shaderPrograms.dummyProgram.vars.texcoord,
    2,
    gl.FLOAT,
    false,
    stride,
    3 * 4
  );
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
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, dummyData.texture);
  gl.uniform1i(shaderPrograms.dummyProgram.vars.texture, 0);
  gl.drawElements(gl.TRIANGLES, dummyData.count, gl.UNSIGNED_SHORT, 0);
}

function updateVertexData(mesh, vertex_buffer, index_buffer) {
  let vertices = [];
  // TODO use concat
  mesh.vertices.forEach(v => {
    vertices.push(v.position.x);
    vertices.push(v.position.y);
    vertices.push(v.position.z);
    vertices.push(v.texcoord.x);
    vertices.push(v.texcoord.y);
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
