var regl = require('regl')()
var labelEngine = require('../')({
  outlines: true,
  types: {
    bbox: require('../preset/bbox')(),
    point: require('../preset/point')(),
    line: require('../preset/line')(),
  }
})

var labels = [ { type: 'bbox', bounds: [-1,-1,+1,+1] } ]
for (var i = 0; i < 25; i++) {
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

labels.push((function () {
  var positions = [
    +0.3,-1.0,
    +0.1,-0.5,
    +0.0,+0.4,
    +0.4,+0.5,
    +0.7,+0.8,
    +0.6,+1.0
  ]
  var line = new Float32Array(positions.length*4)
  var offset = 0
  for (var i = 0; i < positions.length-2; i+=2) {
    line[offset++] = positions[i+0]
    line[offset++] = positions[i+1]
    line[offset++] = positions[i+2]
    line[offset++] = positions[i+3]
  }
  return {
    type: 'line',
    positions: positions,
    line: line,
    pxLabelSize: [100,20],
    pxLabelMargin: [10,10],
    labelSize: [0,0],
    labelMargin: [0,0],
    width: 0,
    height: 0
  }
})())

var counts = { point: 0, line: 0 }
for (var i = 0; i < labels.length; i++) {
  if (labels[i].type === 'point') {
    counts.point++
  } else if (labels[i].type === 'line') {
    counts.line += labels[i].line.length
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
  positions: new Float32Array(counts.line*2),
  count: { outlines: counts.line }
}
lines.data = { outlines: lines.positions }

function update() {
  var m = Math.max(window.innerWidth,window.innerHeight)
  var w = window.innerWidth, h = window.innerHeight
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].type === 'point') {
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
    } else if (labels[i].type === 'line') {
      labels[i].labelSize[0] = labels[i].pxLabelSize[0]/w*2
      labels[i].labelSize[1] = labels[i].pxLabelSize[1]/h*2
      labels[i].labelMargin[0] = labels[i].pxLabelMargin[0]/w*2
      labels[i].labelMargin[1] = labels[i].pxLabelMargin[1]/h*2
      labels[i].aspect = w/h
    }
  }
  labelEngine.update(labels)

  var poffset = 0, aoffset = 0, loffset = 0
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].type === 'point') {
      points.positions[poffset++] = labels[i].point[0]
      points.positions[poffset++] = labels[i].point[1]
      points.active[aoffset++] = labelEngine._visible[i]
    } else if (labels[i].type === 'line') {
      for (var j = 0; j < labels[i].positions.length-2; j+=2) {
        lines.positions[loffset++] = labels[i].positions[j+0]
        lines.positions[loffset++] = labels[i].positions[j+1]
        lines.positions[loffset++] = labels[i].positions[j+2]
        lines.positions[loffset++] = labels[i].positions[j+3]
      }
      counts.line += labels[i].positions.length/2
    }
  }
  frame()
}

var draw = {
  point: point(regl),
  outlines: outlines(regl, [1,0,0]),
  lines: outlines(regl, [0,0.5,0.5]),
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
  draw.lines(lines)
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

function outlines(regl, color) {
  return regl({
    frag: `
      precision highp float;
      uniform vec3 color;
      void main() {
        gl_FragColor = vec4(color,1);
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
    uniforms: { color },
    count: regl.prop('count.outlines')
  })
}
