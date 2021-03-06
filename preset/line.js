var vec2set = require('gl-vec2/set')
var defaultScale = [1,1]
var defaultSides = ['left','right','center']
var order = require('bfs2inorder')
var v0 = [0,0]
var v1 = [0,0]
var v2 = [0,0]
var v3 = [0,0]

module.exports = function (params) {
  if (!params) params = {}
  return {
    size: function (out, f) {
      out.cells = 6
      out.positions = 8
      out.bounds = 8
    },
    write: function (out, f) {
      var sides = f.sides || params.sides || defaultSides
      var side = f.side || params.side || sides[out.index % sides.length]
      var index = -1
      if (f.side || params.side) {
        index = out.index
      } else if (sides.length === 0) {
        return
      } else {
        index = Math.floor(out.index / sides.length)
      }

      var n = f.positions.length/2
      if (out.index >= n-1) return
      var i = order(n-1, out.index)
      if (i < 0) return

      var scale = f.scale || params.scale || defaultScale
      var positions = f.positions || params.positions
      var positionsScale = f.positionsScale || params.positionsScale || scale
      var p0 = positions[i*2+0]*positionsScale[0]
      var p1 = positions[i*2+1]*positionsScale[1]
      var p2 = positions[i*2+2]*positionsScale[0]
      var p3 = positions[i*2+3]*positionsScale[1]
      var labelSize = f.labelSize || params.labelSize
      var labelSizeScale = f.labelSizeScale || params.labelSizeScale || scale
      var labelSize0 = labelSize[0]*labelSizeScale[0]
      var labelSize1 = labelSize[1]*labelSizeScale[1]
      var labelMargin = f.labelMargin || params.labelMargin
      var labelMarginScale = f.labelMarginScale || params.labelMarginScale || defaultScale
      var labelMargin0 = labelMargin[0]*labelMarginScale[0]
      var labelMargin1 = labelMargin[1]*labelMarginScale[1]
      var aspect = f.aspect || params.aspect || 1
      var labelLineMargin = f.labelLineMargin || params.labelLineMargin || 0
      var labelLineMarginScale = f.labelLineMarginScale || params.labelLineMarginScale || scale
      var labelLineMargin0 = labelLineMargin
        * (Array.isArray(labelLineMarginScale) ? labelLineMarginScale[1] : labelLineMarginScale)

      var cx = (p0+p2)/2*aspect
      var cy = (p1+p3)/2
      var lsx = labelSize0*aspect/2
      var lsy = labelSize1/2
      var x0, x1, y0, y1
      if (side === 'left') {
        x0 = cx - lsx
        x1 = cx + lsx
        y0 = cy - lsy*2 - labelLineMargin0
        y1 = cy - labelLineMargin0
      } else if (side === 'center') {
        x0 = cx - lsx
        x1 = cx + lsx
        y0 = cy - lsy
        y1 = cy + lsy
      } else if (side === 'right') {
        x0 = cx - lsx
        x1 = cx + lsx
        y0 = cy + labelLineMargin0
        y1 = cy + lsy*2 + labelLineMargin0
      }
      vec2set(v0, x0, y0)
      vec2set(v1, x1, y0)
      vec2set(v2, x1, y1)
      vec2set(v3, x0, y1)
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
