//https://blog.mayflower.de/4584-Playing-around-with-pixel-shaders-in-WebGL.html

window.onload = function() {
  //set up the canvas and webGL context
  var canvas = document.getElementById('canvas');
  gl = canvas.getContext('webgl');
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  //set up the fragment shader that we'll be using
  program = gl.createProgram();
  gl.attachShader(program, getShader('vertex-shader', gl.VERTEX_SHADER));
  gl.attachShader(program, getShader('fragment-shader', gl.FRAGMENT_SHADER));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialise shaders. Error ' + gl.LINK_STATUS);
  }

  gl.useProgram(program);

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0]),
    gl.STATIC_DRAW
  );

  var positionLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  window.requestAnimationFrame(render);
};

function getShader(srcId,shaderType) {
  var shader = gl.createShader(shaderType),
      shaderSrc = document.getElementById(srcId).textContent;
  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

var fpsDisplay = document.getElementById('fps');
var iterationDisplay = document.getElementById('iteration')
var steps = 1;
function render() {
  window.requestAnimationFrame(render);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  steps += 1/20;
  gl.uniform1f(gl.getUniformLocation(program, 'maxSteps'),steps);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  fpsDisplay.innerHTML = fpsCounter.getFPS() + ' FPS';
  iterationDisplay.innerHTML = (steps | 0) + ' iterations deep.'
}
