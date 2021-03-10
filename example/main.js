var regl = require('regl')()
var labelEngine = require('../')({
  types: {
    point: {
      size: function (out) {
        out.cells = 6
        out.positions = 8
        out.bounds = 16
      },
      initialState: 0,
      write: function (out, f) {
        var xmin, ymin, xmax, ymax
        if (out.state === 0) { // top
          xmin = f.point[0] - f.size[0]/2
          xmax = f.point[0] + f.size[0]/2
          ymin = f.point[1] + f.space[1]
          ymax = f.point[1] + f.space[1] + f.size[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.space[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.space[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1] - f.space[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.space[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1] - f.space[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.space[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmin + f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmin + f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.pad[1]
        } else if (out.state === 1) { // bottom
          xmin = f.point[0] - f.size[0]/2
          xmax = f.point[0] + f.size[0]/2
          ymin = f.point[1] - f.space[1] - f.size[1]
          ymax = f.point[1] - f.space[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmax + f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmax + f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.space[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.space[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.space[1] + f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.space[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.space[1] + f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.space[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.pad[1]
        } else if (out.state === 2) { // right
          xmin = f.point[0] + f.space[0]
          xmax = f.point[0] + f.space[0] + f.size[0]
          ymin = f.point[1] - f.size[1]/2
          ymax = f.point[1] + f.size[1]/2
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.space[0] - f.pad[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] - f.space[1] - f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.pad[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] - f.space[1] - f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmax + f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmax + f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.pad[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.space[1] + f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.space[0] - f.pad[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.space[1] + f.pad[1]
        } else if (out.state === 3) { // left
          xmin = f.point[0] - f.space[0] - f.size[0]
          xmax = f.point[0] - f.space[0]
          ymin = f.point[1] - f.size[1]/2
          ymax = f.point[1] + f.size[1]/2
          out.bounds.data[out.bounds.offset++] = xmin - f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.space[0] - f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.space[0] - f.pad[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] - f.space[1] - f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.space[0] + f.pad[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] - f.space[1] - f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.space[0] + f.pad[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.space[1] + f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.space[0] - f.pad[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.space[1] + f.pad[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.space[0] - f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.pad[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.pad[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.pad[1]
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

var labels = []
for (var i = 0; i < 150; i++) {
  labels.push({
    type: 'point',
    pxSize: [80,25],
    pxSpace: [10,10],
    pxPad: [10,10],
    size: [0,0],
    space: [0,0],
    pad: [0,0],
    point: [Math.random()*2-1,Math.random()*2-1]
  })
}
var points = {
  positions: labels.map((l) => l.point)
}

function update() {
  var m = Math.max(window.innerWidth,window.innerHeight)
  var w = window.innerWidth, h = window.innerHeight
  for (var i = 0; i < labels.length; i++) {
    labels[i].size[0] = labels[i].pxSize[0]/w*2
    labels[i].size[1] = labels[i].pxSize[1]/h*2
    labels[i].space[0] = labels[i].pxSpace[0]/w*2
    labels[i].space[1] = labels[i].pxSpace[1]/h*2
    labels[i].pad[0] = labels[i].pxPad[0]/w*2
    labels[i].pad[1] = labels[i].pxPad[1]/h*2
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
  draw.box(labelEngine.data)
  draw.point(points)
}

function box(regl) {
  return regl({
    frag: `
      precision highp float;
      varying float vvisible;
      void main() {
        if (vvisible < 0.5) discard;
        gl_FragColor = vec4(0.5,0.5,0.5,1);
      }
    `,
    vert: `
      precision highp float;
      attribute vec2 position;
      attribute float visible;
      varying float vvisible;
      void main() {
        vvisible = visible;
        gl_Position = vec4(position,0,1);
      }
    `,
    attributes: {
      position: regl.prop('positions'),
      visible: regl.prop('visible')
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
