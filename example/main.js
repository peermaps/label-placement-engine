var regl = require('regl')()
var labelEngine = require('../')({
  outlines: true,
  types: {
    bounds: {
      size: function (out) {
        out.cells = 0
        out.positions = 0
        out.bounds = 20
      },
      write: function (out, f) {
        var xmin = f.bounds[0]
        var ymin = f.bounds[1]
        var xmax = f.bounds[2]
        var ymax = f.bounds[3]
        var dx = 0.01, dy = 0.01
        out.bounds.data[out.bounds.offset++] = xmin
        out.bounds.data[out.bounds.offset++] = ymin
        out.bounds.data[out.bounds.offset++] = xmin
        out.bounds.data[out.bounds.offset++] = ymax
        out.bounds.data[out.bounds.offset++] = xmax
        out.bounds.data[out.bounds.offset++] = ymax
        out.bounds.data[out.bounds.offset++] = xmax
        out.bounds.data[out.bounds.offset++] = ymin
        out.bounds.data[out.bounds.offset++] = xmin
        out.bounds.data[out.bounds.offset++] = ymin
        out.bounds.data[out.bounds.offset++] = xmin - dx
        out.bounds.data[out.bounds.offset++] = ymin - dy
        out.bounds.data[out.bounds.offset++] = xmax + dx
        out.bounds.data[out.bounds.offset++] = ymin - dy
        out.bounds.data[out.bounds.offset++] = xmax + dx
        out.bounds.data[out.bounds.offset++] = ymax + dy
        out.bounds.data[out.bounds.offset++] = xmin - dx
        out.bounds.data[out.bounds.offset++] = ymax + dy
        out.bounds.data[out.bounds.offset++] = xmin - dx
        out.bounds.data[out.bounds.offset++] = ymin - dy
      }
    },
    point: {
      size: function (out) {
        out.cells = 6
        out.positions = 8
        out.bounds = 16
      },
      write: function (out, f) {
        var xmin, ymin, xmax, ymax
        // labelSize: [0,0], // dimensions of the label
        // labelMargin: [0,0], // space around the label
        // pointSize: [10,10], // size of the point
        // pointMargin: [5,5], // space around the point
        // pointSeparation: [10,10], // distance between the label and point
        if (out.index === 0) { // top
          xmin = f.point[0] - f.labelSize[0]/2
          xmax = f.point[0] + f.labelSize[0]/2
          ymin = f.point[1] + f.pointMargin[1]
          ymax = f.point[1] + f.pointMargin[1] + f.labelSize[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] - f.pointSize[1]/2 - f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.pointSize[0]/2 + f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] - f.pointSize[1]/2 - f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.pointSize[0]/2 + f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmax + f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmax + f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.labelMargin[1]
        } else if (out.index === 1) { // bottom
          xmin = f.point[0] - f.labelSize[0]/2
          xmax = f.point[0] + f.labelSize[0]/2
          ymin = f.point[1] - f.pointMargin[1] - f.labelSize[1]
          ymax = f.point[1] - f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmax + f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmax + f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.pointSize[0]/2 + f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.pointSize[0]/2 + f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.pointSize[1]/2 + f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.pointSize[1]/2 + f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.labelMargin[1]
        } else if (out.index === 2) { // right
          xmin = f.point[0] + f.pointSize[0]/2 + f.pointMargin[0]
          xmax = f.point[0] + f.pointSize[0]/2 + f.pointMargin[0] + f.labelSize[0]
          ymin = f.point[1] - f.labelSize[1]/2
          ymax = f.point[1] + f.labelSize[1]/2
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] - f.pointSize[1]/2 - f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] - f.pointSize[1]/2 - f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmax + f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmax + f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.pointSize[1]/2 + f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.pointSize[1]/2 + f.pointMargin[1]
        } else if (out.index === 3) { // left
          xmin = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0] - f.labelSize[0]
          xmax = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          ymin = f.point[1] - f.labelSize[1]/2
          ymax = f.point[1] + f.labelSize[1]/2
          out.bounds.data[out.bounds.offset++] = xmin - f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = ymin - f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] - f.pointSize[1]/2 - f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.pointSize[0]/2 + f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] - f.pointSize[1]/2 - f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] + f.pointSize[0]/2 + f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.pointSize[1]/2 + f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = f.point[1] + f.pointSize[1]/2 + f.pointMargin[1]
          out.bounds.data[out.bounds.offset++] = f.point[0] - f.pointSize[0]/2 - f.pointMargin[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.labelMargin[1]
          out.bounds.data[out.bounds.offset++] = xmin - f.labelMargin[0]
          out.bounds.data[out.bounds.offset++] = ymax + f.labelMargin[1]
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
      }
    },
    line: {
      size: function (out) {
        out.cells = 6
        out.positions = 8
        out.bounds = 8
      },
      initialState: 0,
      write: function (out, f) {
      }
    }
  }
})

var labels = [
  { type: 'bounds', bounds: [-1,-1,+1,+1] }
]
for (var i = 0; i < 250; i++) {
  labels.push({
    type: 'point',
    pxLabelSize: [0,0], // dimensions of the label
    pxLabelMargin: [10,10], // space around the label
    pxPointSize: [10,10], // size of the point
    pxPointMargin: [10,10], // space around the point
    pxPointSeparation: [10,10], // distance between the label and point
    labelSize: [0,0],
    labelMargin: [0,0],
    pointSize: [0,0],
    pointMargin: [0,0],
    point:[0,0],
    pointSeparation: [0,0]
  })
}
var counts = { point: 0, line: 0 }
for (var i = 0; i < labels.length; i++) {
  if (labels[i].type === 'point') {
    counts.point++
  } else if (labels[i].type === 'line') {
    counts.line += labels[i].points.length*2
  }
}

function randomize() {
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].type !== 'point') continue
    labels[i].pxLabelSize[0] = 50 + Math.random()*150
    labels[i].pxLabelSize[1] = 20
    labels[i].point[0] = Math.random()*2-1
    labels[i].point[1] = Math.random()*2-1
  }
  update()
}

var points = {
  positions: new Float32Array(counts.point*2),
  active: new Float32Array(counts.point)
}
var lines = {
  positions: new Float32Array(counts.line*2)
}

function update() {
  var m = Math.max(window.innerWidth,window.innerHeight)
  var w = window.innerWidth, h = window.innerHeight
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].type !== 'point') continue
    labels[i].labelSize[0] = labels[i].pxLabelSize[0]/w*2
    labels[i].labelSize[1] = labels[i].pxLabelSize[1]/h*2
    labels[i].labelMargin[0] = labels[i].pxLabelMargin[0]/w*2
    labels[i].labelMargin[1] = labels[i].pxLabelMargin[1]/h*2
    labels[i].pointSize[0] = labels[i].pxPointSize[0]/w*2
    labels[i].pointSize[1] = labels[i].pxPointSize[1]/h*2
    labels[i].pointMargin[0] = labels[i].pxPointMargin[0]/w*2
    labels[i].pointMargin[1] = labels[i].pxPointMargin[1]/h*2
    labels[i].pointSeparation[0] = labels[i].pxPointSeparation[0]/w*2
    labels[i].pointSeparation[1] = labels[i].pxPointSeparation[1]/h*2
  }
  labelEngine.update(labels)

  var poffset = 0, aoffset = 0
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].type !== 'point') continue
    points.positions[poffset++] = labels[i].point[0]
    points.positions[poffset++] = labels[i].point[1]
    points.active[aoffset++] = labelEngine._visible[i]
  }
  frame()
}

var draw = {
  point: point(regl),
  outlines: outlines(regl),
  box: box(regl),
}
randomize()

window.addEventListener('resize', update)

function frame() {
  regl.poll()
  regl.clear({ color: [0,0,0,1], depth: true })
  draw.box(labelEngine)
  draw.point(points)
  draw.outlines(labelEngine)
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
      position: regl.prop('data.positions')
    },
    elements: regl.prop('data.cells'),
    count: regl.prop('count.cells')
  })
}

function point(regl) {
  return regl({
    frag: `
      precision highp float;
      varying float vactive;
      void main() {
        gl_FragColor = vec4(mix(vec3(0.3),vec3(1),vactive),1);
      }
    `,
    vert: `
      precision highp float;
      attribute vec2 position;
      attribute float active;
      varying float vactive;
      void main() {
        vactive = active;
        gl_Position = vec4(position,0,1);
        gl_PointSize = 10.0;
      }
    `,
    primitive: 'points',
    attributes: {
      position: regl.prop('positions'),
      active: regl.prop('active')
    },
    count: (context,props) => props.positions.length/2
  })
}

function outlines(regl) {
  return regl({
    frag: `
      precision highp float;
      void main() {
        gl_FragColor = vec4(1,0,0,1);
      }
    `,
    vert: `
      precision highp float;
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position,0,1);
      }
    `,
    primitive: 'lines',
    lineWidth: 2,
    attributes: {
      position: regl.prop('data.outlines')
    },
    count: regl.prop('count.outlines')
  })
}
