var regl = require('regl')()
var scale = [2/window.innerWidth,2/window.innerHeight]
var labelEngine = require('../')({
  outlines: true,
  types: {
    bbox: require('../preset/bbox')(),
    point: require('../preset/point')({
      labelMargin: [10,10],
      pointSize: [10,10],
      pointMargin: [10,10],
      pointSeparation: [10,10],
      labelSizeScale: scale,
      labelMarginScale: scale,
      pointSizeScale: scale,
      pointMarginScale: scale,
      pointSeparationScale: scale,
    }),
    line: require('../preset/line')({
      sides: ['left','right'],
      labelSize: [100,20],
      labelMargin: [10,10],
      labelSizeScale: scale,
      labelMarginScale: scale,
      labelLineMargin: 10,
      labelLineMarginScale: scale,
      aspect: window.innerWidth/window.innerHeight
    }),
  }
})

var labels = [ { type: 'bbox', bounds: [-1,-1,+1,+1] } ]

for (var i = 0; i < 25; i++) {
  labels.push({
    type: 'point',
    labelSize: [0,0],
    point: [0,0]
  })
}

labels.push((function () {
  var positions = [ +0.3,-1.0, +0.1,-0.5, +0.0,+0.4, +0.4,+0.5, +0.7,+0.8, +0.6,+1.0 ]
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
    line: line
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
    labels[i].labelSize[0] = 50 + Math.random()*150
    labels[i].labelSize[1] = 20
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
  var w = window.innerWidth, h = window.innerHeight
  scale[0] = 2/w
  scale[1] = 2/h
  labelEngine.types.line.params.aspect = w/h
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
