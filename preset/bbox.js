module.exports = function () {
  return {
    size: function (out, f) {
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
  }
}
