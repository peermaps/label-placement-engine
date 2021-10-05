// initialize with presets
var labelEngine = require('../')({
  types: {
    point: require('../preset/point')({
      labelMargin: [10,10],
      pointSize: [10,10],
      pointMargin: [10,10],
      pointSeparation: [10,10],
    }),
  }
})

// build label data for preset types
var labels = []
for (var i = 0; i < 20; i++) {
  var x = Math.random()*250, y = Math.random()*250
  labels.push({
    type: 'point',
    labelSize: [50,15],
    point: [x,y]
  })
}
labelEngine.update(labels)

// loop to get data for individual labels
for (var i = 0; i < labels.length; i++) {
  if (labelEngine.isVisible(i)) {
    var pstart = labelEngine.offsets.positions[i*2+0]
    var pend = labelEngine.offsets.positions[i*2+1]
    console.log(i, labelEngine.data.positions.slice(pstart, pend))
  }
}

// or large slices for rendering
console.log({
  positions: labelEngine.data.positions.subarray(0, labelEngine.count.positions),
  cells: labelEngine.data.cells.subarray(0, labelEngine.count.cells),
})
