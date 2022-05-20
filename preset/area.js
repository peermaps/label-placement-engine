var vec2set = require('gl-vec2/set')
var ptest = require('polygon-intersect-test/flat')
var defaultScale = [1,1]
var X = [0,0,0,0,0,0,0,0]
var C = [0,0]

module.exports = function (params) {
  if (!params) params = {}
  return {
    size: function (out, f) {
      out.cells = 6
      out.positions = 8
      out.bounds = 16
    },
    write: function (out, f) {
      vec2set(C, 0, 0)
      var positions = f.positions || params.positions
      if (positions.length < 2) return
      var n = positions.length/2
      for (var i = 0; i < positions.length; i+=2) {
        var x = positions[i+0], y = positions[i+1]
        if (!isNaN(x)) C[0] += x/n
        if (!isNaN(y)) C[1] += y/n
      }

      var scale = f.scale || params.scale || defaultScale
      var positions = f.positions || params.positions
      var positionsScale = f.positionsScale || params.positionsScale || scale

      var labelSize = f.labelSize || params.labelSize
      var labelSizeScale = f.labelSizeScale || params.labelSizeScale || scale
      var labelSize0 = labelSize[0]*labelSizeScale[0]
      var labelSize1 = labelSize[1]*labelSizeScale[1]
      var labelMargin = f.labelMargin || params.labelMargin
      var labelMarginScale = f.labelMarginScale || params.labelMarginScale || defaultScale
      var labelMargin0 = labelMargin[0]*labelMarginScale[0]
      var labelMargin1 = labelMargin[1]*labelMarginScale[1]
      var aspect = f.aspect || params.aspect || 1

      var xmin = C[0] - labelSize0*0.5
      var xmax = C[0] + labelSize0*0.5
      var ymin = C[1] - labelSize1*0.5
      var ymax = C[1] + labelSize1*0.5
      pset(X, xmin, xmax, ymin, ymax)
      if (!ptest(X, positions)) return // only show if label intersects polygon

      out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
      out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
      out.bounds.data[out.bounds.offset++] = xmax + labelMargin0
      out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
      out.bounds.data[out.bounds.offset++] = xmax + labelMargin0
      out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
      out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
      out.bounds.data[out.bounds.offset++] = ymax + labelMargin1

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
    },
    params: params
  }
}

function pset(out, xmin, xmax, ymin, ymax) {
  out[0] = xmin
  out[1] = ymin
  out[2] = xmax
  out[3] = ymin
  out[4] = xmax
  out[5] = ymax
  out[6] = xmin
  out[7] = ymax
}
