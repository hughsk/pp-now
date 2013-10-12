# pp-now [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

Quick setup for single-pass GLSL post-processing with
[gl-now](http://github.com/mikolalysenko/gl-now).

## Usage ##

[![pp-now](https://nodei.co/npm/pp-now.png?mini=true)](https://nodei.co/npm/pp-now)

### `require('pp-now')(shell, fragment[, vertex])` ###

Takes the [game-shell](http://github.com/mikolalysenko/game-shell) returned
by `gl-now`, in addition to a `fragment` shader which takes the following
required variables:

* `uniform sampler2D frame;` - the screen as a 2D texture.
* `varying vec2 uv;` - the coordinates on the screen from 0 to 1.
  Alternatively, you can use `gl_FragCoord.xy` for precise pixel coordinates.

### `shell.on('pp-render', frame(t))` ###

Instead of listening to `gl-render`, listen to `pp-render` to draw to the
post-processing framebuffer.

### `shell.on('pp-uniforms', frame(shader))` ###

Passes the [gl-shader](http://github.com/mikolalysenko/gl-shader) being
used for post-processing to `shell.postProcessing` so that you can update your
own additional uniforms manually.

***

Note that if you're already using framebuffers in your demo it might break -
in which case, you probably won't have much trouble adding post-processing
yourself :)

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/pp-now/blob/master/LICENSE.md) for details.
