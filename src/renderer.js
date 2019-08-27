var glCanvas = document.getElementById("c");
var gl = glCanvas.getContext("webgl2", { antialias: false });

const maxOccluderCount = 128;
const occluderSize = 4;
var occlusionBuffer = gl.createBuffer();
var numOccluders = 0;
var occlusionData = null;
function setOccluders(data) {
  gl.bindBuffer(gl.UNIFORM_BUFFER, occlusionBuffer);
  occlusionData = new Float32Array(data);
  gl.bufferData(gl.UNIFORM_BUFFER, occlusionData, gl.DYNAMIC_DRAW);
  numOccluders = data.length / occluderSize;
  // console.log(data);
}

const windowRad = 0.7;
const windowZ = -1;

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
  // TODO remove error checking
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
    console.log("Error in fragment shader: " + gl.getShaderInfoLog(fragShader));
  if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
    console.log("Error in vertex shader: " + gl.getShaderInfoLog(vertShader));
  return shaderProgram;
}

const lightColor = "vec3(1, 1, 1)*20.0";

// TODO compress shader codes better

let ambientLightIntegrand =
  "-(nx*wx3+nz*wz3-nx*x3+nz*wx2+(nx*wx+ny*wy+3.0*nz)*wz2+(3.0*nx*wx+ny*wy+nz*wz+nz)*x2+nx*wx+(ny*wx2+ny)*wy+(nz*wx2+2.0*nx*wx+2.0*ny*wy+3.0*nz)*wz-(3.0*nx*wx2+2.0*ny*wx*wy+nx*wz2+2.0*nz*wx+2.0*(nz*wx+nx)*wz+nx)*x-(ny*wx2+ny*wz2-2.0*ny*wx*x+ny*x2+2.0*ny*wz+ny)*y+nz)*(wz+1.0)/((pi+pi*wx2+pi*wy2+pi*wz2-2.0*pi*wx*x+pi*x2-2.0*pi*wy*y+pi*y2+2.0*pi*wz)*abs(wx4+wz4-4.0*wx*x3+x4+(wx2+1.0)*wy2+(2.0*wx2+wy2+6.0)*wz2+4.0*wz3+(6.0*wx2+wy2+2.0*wz2+4.0*wz+2.0)*x2+(wx2+wz2-2.0*wx*x+x2+2.0*wz+1.0)*y2+2.0*wx2+2.0*(2.0*wx2+wy2+2.0)*wz-2.0*(2.0*wx3+wx*wy2+2.0*wx*wz2+4.0*wx*wz+2.0*wx)*x-2.0*(wy*wz2-2.0*wx*wy*x+wy*x2+(wx2+1.0)*wy+2.0*wy*wz)*y+1.0))/4.0";

function makePow(v, val, count = 4, type = "float") {
  let ret = type + " " + v + "=" + val + ";";
  for (let i = 2; i <= count; ++i)
    ret += type + " " + v + i + "=" + v + "*" + v + (i > 2 ? i - 1 : "") + ";";
  return ret;
}

function makeVecPow(vec, name, count = 4, type = "float") {
  return (
    makePow(name + "x", vec + ".x", count, type) +
    makePow(name + "y", vec + ".y", count, type) +
    makePow(name + "z", vec + ".z", count, type)
  );
}

let ambientIntegral =
  "  float sum = 0.0;" +
  "  const int Width = 2;" +
  "  const int Height = 2;" +
  "  for (int i = 0; i < Width; ++i) for (int j = 0; j < Height; ++j) {" +
  makePow("x", "mix(-windowRad, windowRad, (float(i) + 0.5)/float(Width))") +
  makePow("y", "mix(-windowRad, windowRad, (float(j) + 0.5)/float(Height))") +
  "    sum += max(" +
  ambientLightIntegrand +
  ", 0.0);" +
  "  }" +
  "  sum /= float(Width*Height);";

let ambientLightShaderCode =
  "float getAmbientLight(vec3 pos, vec3 normal) {" +
  "  float pi = 3.1415926535897932384626433832795;" +
  makeVecPow("normal", "n") +
  makeVecPow("pos", "w") +
  "  float windowRad = " +
  windowRad +
  ";" +
  ambientIntegral +
  "  return sum;" +
  "}";

let ambientOcclusionCode =
  "float ambientOcclusion(vec3 pos, vec3 normal) {" +
  " int occluderSize =" +
  occluderSize +
  ";" +
  " float sum = 0.0;" +
  " for (int i = 0; i < " +
  maxOccluderCount +
  "; ++i) {" +
  "  if(i >= occluderCount) {break;}" + // uggghhhh
  "  sum += occlusion[i*occluderSize+3];" + // TODO
  " }" +
  " return sum;" +
  "}";

let occlusionSubtraction =
  "float getLight(float light, float occlusion) {" +
  " return light - occlusion;" +
  "}";

let cardVertCode =
  "attribute vec3 position;" +
  "attribute vec3 normal;" +
  "attribute vec2 texcoord;" +
  "uniform mat4 proj;" +
  "uniform mat4 view;" +
  "uniform mat4 model;" +
  "uniform int occluderCount;" +
  "uniform float occlusion[" +
  maxOccluderCount * occluderSize +
  "];" +
  "varying highp vec3 fragPos;" +
  "varying highp vec3 norm;" +
  "varying highp vec2 texc;" +
  "varying highp float o;" +
  ambientOcclusionCode +
  "void main(void) {" +
  " vec4 pos = vec4(position, 1);" +
  " gl_Position = proj * view * model * pos;" +
  " fragPos = (model * pos).xyz;" +
  " norm = (model * vec4(normal, 0)).xyz;" +
  " texc = texcoord;" +
  " o = ambientOcclusion(fragPos, norm);" +
  // " l = vec2(1, 1);" +
  "}";
var cardFragCode =
  "precision mediump float;" +
  "varying highp vec3 fragPos;" +
  "varying highp vec3 norm;" +
  "varying highp vec2 texc;" +
  "varying highp float o;" +
  "uniform sampler2D texture;" +
  ambientLightShaderCode +
  " " +
  occlusionSubtraction +
  "void main(void) {" +
  "  vec4 albedo = texture2D(texture, texc);" +
  "  if (albedo.a < 1.0) discard;" +
  "  albedo.a = 1.0;" +
  "  vec3 normal = normalize(norm);" +
  "  float ambientLight = getAmbientLight(fragPos, normal);" +
  "  vec3 diffuse = " +
  lightColor +
  " * getLight(ambientLight, o);" +
  "  gl_FragColor = albedo * vec4(diffuse, 1);" +
  "}";

// console.log(cardVertCode);
shaderPrograms.cardProgram = {};
shaderPrograms.cardProgram.shader = createProgram(cardVertCode, cardFragCode);
shaderPrograms.cardProgram.vars = {
  position: gl.getAttribLocation(shaderPrograms.cardProgram.shader, "position"),
  normal: gl.getAttribLocation(shaderPrograms.cardProgram.shader, "normal"),
  texcoord: gl.getAttribLocation(shaderPrograms.cardProgram.shader, "texcoord"),
  texture: gl.getUniformLocation(shaderPrograms.cardProgram.shader, "texture"),
  proj: gl.getUniformLocation(shaderPrograms.cardProgram.shader, "proj"),
  view: gl.getUniformLocation(shaderPrograms.cardProgram.shader, "view"),
  model: gl.getUniformLocation(shaderPrograms.cardProgram.shader, "model"),
  occlusion: gl.getUniformLocation(
    shaderPrograms.cardProgram.shader,
    "occlusion"
  ),
  occluderCount: gl.getUniformLocation(
    shaderPrograms.cardProgram.shader,
    "occluderCount"
  )
};

var projection = null;

var frameBuffers = {
  render: gl.createFramebuffer()
  // color: gl.createFramebuffer()
};
var colorRenderbuffer = gl.createRenderbuffer();
var depthRenderbuffer = gl.createRenderbuffer();
var frameSize = {};

function resize() {
  let canvasSizeScale = 1;
  glCanvas.width = Math.floor(window.innerWidth * canvasSizeScale);
  glCanvas.height = Math.floor(window.innerHeight * canvasSizeScale);

  // mulitsampling
  // frameSize.w = glCanvas.width;
  // frameSize.h = glCanvas.height;
  // gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderbuffer);
  // gl.renderbufferStorageMultisample(
  //   gl.RENDERBUFFER,
  //   gl.getParameter(gl.MAX_SAMPLES),
  //   gl.RGBA8,
  //   frameSize.w,
  //   frameSize.h
  // );
  // gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
  // gl.renderbufferStorageMultisample(
  //   gl.RENDERBUFFER,
  //   gl.getParameter(gl.MAX_SAMPLES),
  //   gl.DEPTH_COMPONENT16,
  //   frameSize.w,
  //   frameSize.h
  // );

  // rendering in higher resolution for anti-aliasing
  const antiAliasQuality = 2;
  frameSize.w = glCanvas.width * antiAliasQuality;
  frameSize.h = glCanvas.height * antiAliasQuality;
  gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA8, frameSize.w, frameSize.h);
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
  gl.renderbufferStorage(
    gl.RENDERBUFFER,
    gl.DEPTH_COMPONENT16,
    frameSize.w,
    frameSize.h
  );

  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers.render);
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.RENDERBUFFER,
    colorRenderbuffer
  );
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depthRenderbuffer
  );
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

resize();

// CAN_BE_REMOVED
function onWindowResize(evt) {
  resize();
}
window.addEventListener("resize", onWindowResize);

function startRender() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers.render);
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, frameSize.w, frameSize.h);

  projection = getProjection(40, frameSize.w / frameSize.h, 0.01, 100);
}

function endRender() {
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, frameBuffers.render);
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  // gl.clearBufferfv(gl.COLOR, 0, [1.0, 1.0, 1.0, 1.0]);
  gl.blitFramebuffer(
    0,
    0,
    frameSize.w,
    frameSize.h,
    0,
    0,
    glCanvas.width,
    glCanvas.height,
    gl.COLOR_BUFFER_BIT,
    gl.LINEAR
  );
}

function renderCard(renderData, cardData) {
  gl.useProgram(shaderPrograms.cardProgram.shader);
  const stride = 8 * 4;
  gl.enableVertexAttribArray(shaderPrograms.cardProgram.vars.position);
  gl.vertexAttribPointer(
    shaderPrograms.cardProgram.vars.position,
    3,
    gl.FLOAT,
    false,
    stride,
    0
  );
  gl.enableVertexAttribArray(shaderPrograms.cardProgram.vars.normal);
  gl.vertexAttribPointer(
    shaderPrograms.cardProgram.vars.normal,
    3,
    gl.FLOAT,
    false,
    stride,
    3 * 4
  );
  gl.enableVertexAttribArray(shaderPrograms.cardProgram.vars.texcoord);
  gl.vertexAttribPointer(
    shaderPrograms.cardProgram.vars.texcoord,
    2,
    gl.FLOAT,
    false,
    stride,
    6 * 4
  );
  gl.enableVertexAttribArray(shaderPrograms.cardProgram.vars.light);
  gl.uniformMatrix4fv(shaderPrograms.cardProgram.vars.proj, false, projection);
  gl.uniformMatrix4fv(
    shaderPrograms.cardProgram.vars.view,
    false,
    new Float32Array(renderData.view.getFloats())
  );
  gl.uniformMatrix4fv(
    shaderPrograms.cardProgram.vars.model,
    false,
    cardData.model.getFloats()
  );
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cardData.texture);
  gl.uniform1i(shaderPrograms.cardProgram.vars.texture, 0);
  // console.log(numOccluders);
  gl.uniform1i(shaderPrograms.cardProgram.vars.occluderCount, numOccluders);
  // TODO do this in startRender
  if (numOccluders > 0)
    gl.uniform1fv(shaderPrograms.cardProgram.vars.occlusion, occlusionData);
  gl.drawElements(gl.TRIANGLES, cardData.count, gl.UNSIGNED_SHORT, 0);
}

function updateVertexData(mesh, vertex_buffer) {
  let vertices = [];
  traverseVertices(mesh, v => {
    vertices = vertices.concat([
      v.position.x,
      v.position.y,
      v.position.z,
      v.normal.x,
      v.normal.y,
      v.normal.z,
      v.texcoord.x,
      v.texcoord.y
    ]);
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function createTextureFromColor(color) {
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([color.r * 255, color.g * 255, color.b * 255, color.a * 255])
  );

  return texture;
}
