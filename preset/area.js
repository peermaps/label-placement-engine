var vec2set = require('gl-vec2/set')
var ptest = require('polygon-intersect-test/flat')
var defaultScale = [1,1]
var v0 = [0,0], v1 = [0,0], v2 = [0,0], v3 = [0,0]
var P = [0,0,0,0,0,0,0,0]

module.exports = function (params) {
  if (!params) params = {}
  return {
    size: function (out, f) {
      out.cells = 6
      out.positions = 8
      out.bounds = 8
    },
    write: function (out, f) {
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

      var cx = 0, cy = 0, n = positions.length/2
      for (var i = 0; i < positions.length; i+=2) {
        cx += positions[i+0]/n
        cy += positions[i+1]/n
      }
      var lsx = labelSize0*aspect/2
      var lsy = labelSize1/2
      var x0 = cx - lsx
      var x1 = cx + lsx
      var y0 = cy - lsy
      var y1 = cy + lsy
      vec2set(v0, x0, y0)
      vec2set(v1, x1, y0)
      vec2set(v2, x1, y1)
      vec2set(v3, x0, y1)
      pset(P, v0, v1, v2, v3)
      if (!ptest(P, positions)) return // only show if label intersects polygon

      out.positions.data[out.positions.offset++] = v0[0]/aspect
      out.positions.data[out.positions.offset++] = v0[1]
      out.positions.data[out.positions.offset++] = v1[0]/aspect
      out.positions.data[out.positions.offset++] = v1[1]
      out.positions.data[out.positions.offset++] = v2[0]/aspect
      out.positions.data[out.positions.offset++] = v2[1]
      out.positions.data[out.positions.offset++] = v3[0]/aspect
      out.positions.data[out.positions.offset++] = v3[1]

      var px = labelMargin0*aspect
      var py = labelMargin1
      x0 -= px
      x1 += px
      y0 -= py
      y1 += py
      vec2set(v0, x0, y0)
      vec2set(v1, x1, y0)
      vec2set(v2, x1, y1)
      vec2set(v3, x0, y1)
      out.bounds.data[out.bounds.offset++] = v0[0]/aspect
      out.bounds.data[out.bounds.offset++] = v0[1]
      out.bounds.data[out.bounds.offset++] = v1[0]/aspect
      out.bounds.data[out.bounds.offset++] = v1[1]
      out.bounds.data[out.bounds.offset++] = v2[0]/aspect
      out.bounds.data[out.bounds.offset++] = v2[1]
      out.bounds.data[out.bounds.offset++] = v3[0]/aspect
      out.bounds.data[out.bounds.offset++] = v3[1]

      out.cells.data[out.cells.offset++] = 0
      out.cells.data[out.cells.offset++] = 1
      out.cells.data[out.cells.offset++] = 2
      out.cells.data[out.cells.offset++] = 0
      out.cells.data[out.cells.offset++] = 2
      out.cells.data[out.cells.offset++] = 3
    },
    params: params
  }
}

function pset(X, p0, p1, p2, p3) {
  X[0] = p0[0]
  X[1] = p0[1]
  X[2] = p1[0]
  X[3] = p1[1]
  X[4] = p2[0]
  X[5] = p2[1]
  X[6] = p3[0]
  X[7] = p3[1]
}
