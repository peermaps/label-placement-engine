var defaultScale = [1,1]
var defaultThickness = [1000,1000]

module.exports = function (params) {
  if (!params) params = {}
  return {
    size: function (out, f) {
      out.cells = 0
      out.positions = 0
      out.bounds = 20
    },
    write: function (out, f) {
      var scale = f.scale || params.scale || defaultScale
      var bounds = f.bounds || params.bounds
      var boundsScale = f.boundsScale || params.boundsScale || scale
      var xmin = bounds[0]*boundsScale[0]
      var ymin = bounds[1]*boundsScale[1]
      var xmax = bounds[2]*boundsScale[0]
      var ymax = bounds[3]*boundsScale[1]
      var thickness = f.thickness || params.thickness || defaultThickness
      var thicknessScale = f.thicknessScale || params.thicknessScale || scale
      var dx = thickness[0]*thicknessScale[0]
      var dy = thickness[1]*thicknessScale[1]
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
    },
    params: params
  }
}
