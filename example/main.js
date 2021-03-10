var regl = require('regl')()
var labelEngine = require('../')({
  types: {
    point: {
      size: function (out) {
        out.cells = 6
        out.positions = 8
      },
      initialState: 0,
      write: function (out, f) {
        var xmin, ymin, xmax, ymax
        if (out.state === 0) { // top
          xmin = f.point[0] - f.size[0]/2
          xmax = f.point[0] + f.size[0]/2
          ymin = f.point[1] + f.space[1]
          ymax = f.point[1] + f.space[1] + f.size[1]
        } else if (out.state === 1) { // bottom
          xmin = f.point[0] - f.size[0]/2
          xmax = f.point[0] + f.size[0]/2
          ymin = f.point[1] - f.space[1] - f.size[1]
          ymax = f.point[1] - f.space[1]
        } else if (out.state === 2) { // right
          xmin = f.point[0] + f.space[0]
          xmax = f.point[0] + f.space[0] + f.size[0]
          ymin = f.point[1] - f.size[1]/2
          ymax = f.point[1] + f.size[1]/2
        } else if (out.state === 3) { // left
          xmin = f.point[0] - f.space[0] - f.size[0]
          xmax = f.point[0] - f.space[0]
          ymin = f.point[1] - f.size[1]/2
          ymax = f.point[1] + f.size[1]/2
        } else {
          return
        }
        out.cells.data[out.cells.offset++] = 0
        out.cells.data[out.cells.offset++] = 1
        out.cells.data[out.cells.offset++] = 2
        out.cells.data[out.cells.offset++] = 0
        out.cells.data[out.cells.offset++] = 2
        out.cells.data[out.cells.offset++] = 3
        out.positions.data[out.positions.offset++] = xmin
        out.positions.data[out.positions.offset++] = ymin
        out.positions.data[out.positions.offset++] = xmax
        out.positions.data[out.positions.offset++] = ymin
        out.positions.data[out.positions.offset++] = xmax
        out.positions.data[out.positions.offset++] = ymax
        out.positions.data[out.positions.offset++] = xmin
        out.positions.data[out.positions.offset++] = ymax
        out.state++
      }
    }
  }
})

var points = []
function update() {
  var m = Math.max(window.innerWidth,window.innerHeight)
  var w = window.innerWidth, h = window.innerHeight
  var labels = [
    { type: 'point', size: [80/w*2,25/h*2], space: [10/w*2,10/h*2], point: [0,0] },
    { type: 'point', size: [80/w*2,25/h*2], space: [10/w*2,10/h*2], point: [-0.2,-0.5] },
    { type: 'point', size: [80/w*2,25/h*2], space: [10/w*2,10/h*2], point: [0.1,0.02] }
  ]
  points = {
    positions: labels.map(function (l) {
      return l.point
    })
  }
  labelEngine.update(labels)
  for (var i = 0; i < 4; i++) {
    if (labelEngine.step() === 0) break
  }
  frame()
}

var draw = {
  point: point(regl),
  box: box(regl),
}
update()

window.addEventListener('resize', update)

function frame() {
  regl.poll()
  regl.clear({ color: [0,0,0,1], depth: true })
  draw.point(points)
  draw.box(labelEngine.data)
}

function box(regl) {
  return regl({
    frag: `
      precision highp float;
      void main() {
        gl_FragColor = vec4(0.5,0.5,0.5,1);
      }
    `,
    vert: `
      precision highp float;
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position,0,1);
      }
    `,
    attributes: {
      position: regl.prop('positions')
    },
    elements: regl.prop('cells')
  })
}

function point(regl) {
  return regl({
    frag: `
      precision highp float;
      void main() {
        gl_FragColor = vec4(1,1,1,1);
      }
    `,
    vert: `
      precision highp float;
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position,0,1);
        gl_PointSize = 10.0;
      }
    `,
    primitive: 'points',
    attributes: {
      position: regl.prop('positions')
    },
    count: (context,props) => props.positions.length
  })
}
