var glCanvas = document.getElementById("c");
var gl = glCanvas.getContext("experimental-webgl");

function startRender() {
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);
}

function endRender() {}
