var createBuffer = require('gl-buffer')
var createShader = require('gl-shader')
var debouncer    = require('debounce')
var createFBO    = require('gl-fbo')
var createVAO    = require('gl-vao')

module.exports = postprocessing

function postprocessing(shell, frag, vert) {
  var shape = new Float32Array([0, 0])
  var vertices
  var shader
  var frame
  var height
  var width
  var gl

  var verts = new Float32Array([
    -1, -1,  +1, -1,  -1, +1,
    -1, +1,  +1, -1,  +1, +1,
  ])

  shell.on('gl-init', function() {
    gl = shell.gl

    initFBO(shell.width, shell.height)
    vertices = createVAO(gl, null, [{
        type: gl.FLOAT
      , size: 2
      , buffer: createBuffer(gl, verts)
    }])

    shell.postProcessing =
    shader = typeof frag !== 'string'
      ? frag : createShader(gl
        , vert || defaultVertexShader
        , frag
      )
  })

  shell.on('resize', debouncer(initFBO, 500))
  shell.on('gl-render', function(t) {
    width = shell.width
    height = shell.height

    // Set up the frame buffer so that calls during
    // "pp-render" are directed there instead of the
    // main frame.
    frame.bind()
    gl.viewport(0, 0, shape[0], shape[1])
    if (shell.clearFlags & gl.STENCIL_BUFFER_BIT) gl.clearStencil(shell.clearStencil)
    if (shell.clearFlags & gl.DEPTH_BUFFER_BIT) gl.clearDepth(shell.clearDepth)
    if (shell.clearFlags & gl.COLOR_BUFFER_BIT) gl.clearColor(
        shell.clearColor[0]
      , shell.clearColor[1]
      , shell.clearColor[2]
      , shell.clearColor[3]
    )
    if (shell.clearFlags) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
    }

    shell.emit('pp-render', t)

    // Reset the frame buffer to draw to the
    // canvas.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, width, height)

    shader.bind()
    shader.uniforms.frame = frame.color.bind(0)
    shader.uniforms.depth = frame.depth.bind(1)
    shader.uniforms.frameSize = shape
    shader.attributes.location = 0
    shell.emit('pp-uniforms', shader)

    vertices.bind()
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    vertices.unbind()
  })

  function initFBO(width, height) {
    if (shape[0] === width && shape[1] === height) return
    if (frame) frame.dispose()
    frame = createFBO(gl
      , shape[0] = width
      , shape[1] = height
    )
    frame.color.minFilter = gl.NEAREST
    frame.color.maxFilter = gl.NEAREST
    frame.color.wrapS = gl.CLAMP_TO_EDGE
    frame.color.wrapT = gl.CLAMP_TO_EDGE
  }
}

var defaultVertexShader = [
  'attribute vec2 position;'
, 'varying vec2 uv;'
, 'void main() {'
  , 'gl_Position = vec4(position, 0.0, 1.0);'
  , 'uv = 0.5 * (position + 1.0);'
, '}'
].join('\n')
