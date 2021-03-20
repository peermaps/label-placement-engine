var v0 = [0,0]
var v1 = [0,0]
var v2 = [0,0]
var v3 = [0,0]

module.exports = function () {
  return {
    size: function (out, f) {
      out.cells = 6
      out.positions = 8
      out.bounds = 8
    },
    write: function (out, f) {
      var i = Math.floor((f.positions.length/2-1)/2)
        + Math.floor((out.index+1)/2) * ((out.index%2)*2-1)
      if (i*2 >= f.positions.length) return
      var dx = (f.positions[i*2+0]-f.positions[i*2+2])*f.aspect
      var dy = (f.positions[i*2+1]-f.positions[i*2+3])
      var theta = Math.atan2(dy,dx)
      var s = Math.sin(theta), c = Math.cos(theta)
      var cx = (f.positions[i*2+0]+f.positions[i*2+2])/2*f.aspect
      var cy = (f.positions[i*2+1]+f.positions[i*2+3])/2
      var lsx = f.labelSize[0]*f.aspect/2
      var lsy = f.labelSize[1]/2
      var x0 = cx - lsx
      var x1 = cx + lsx
      var y0 = cy - lsy
      var y1 = cy + lsy
      rotate(v0, cx, cy, s, c, x0, y0)
      rotate(v1, cx, cy, s, c, x1, y0)
      rotate(v2, cx, cy, s, c, x1, y1)
      rotate(v3, cx, cy, s, c, x0, y1)
      out.positions.data[out.positions.offset++] = v0[0]/f.aspect
      out.positions.data[out.positions.offset++] = v0[1]
      out.positions.data[out.positions.offset++] = v1[0]/f.aspect
      out.positions.data[out.positions.offset++] = v1[1]
      out.positions.data[out.positions.offset++] = v2[0]/f.aspect
      out.positions.data[out.positions.offset++] = v2[1]
      out.positions.data[out.positions.offset++] = v3[0]/f.aspect
      out.positions.data[out.positions.offset++] = v3[1]

      var px = f.labelMargin[0]*f.aspect
      var py = f.labelMargin[1]
      x0 -= px
      x1 += px
      y0 -= py
      y1 += py
      rotate(v0, cx, cy, s, c, x0, y0)
      rotate(v1, cx, cy, s, c, x1, y0)
      rotate(v2, cx, cy, s, c, x1, y1)
      rotate(v3, cx, cy, s, c, x0, y1)
      out.bounds.data[out.bounds.offset++] = v0[0]/f.aspect
      out.bounds.data[out.bounds.offset++] = v0[1]
      out.bounds.data[out.bounds.offset++] = v1[0]/f.aspect
      out.bounds.data[out.bounds.offset++] = v1[1]
      out.bounds.data[out.bounds.offset++] = v2[0]/f.aspect
      out.bounds.data[out.bounds.offset++] = v2[1]
      out.bounds.data[out.bounds.offset++] = v3[0]/f.aspect
      out.bounds.data[out.bounds.offset++] = v3[1]

      out.cells.data[out.cells.offset++] = 0
      out.cells.data[out.cells.offset++] = 1
      out.cells.data[out.cells.offset++] = 2
      out.cells.data[out.cells.offset++] = 0
      out.cells.data[out.cells.offset++] = 2
      out.cells.data[out.cells.offset++] = 3
    }
  }
}

function rotate(out, cx, cy, s, c, x, y) {
  out[0] = x - cx
  out[1] = y - cy
  var xn = out[0]*c - out[1]*s
  var yn = out[0]*s + out[1]*c
  out[0] = xn + cx
  out[1] = yn + cy
  return out
}
