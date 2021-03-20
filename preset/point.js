module.exports = function () {
  // labelSize: dimensions of the label
  // labelMargin: space around the label
  // pointSize: size of the point
  // pointMargin: space around the point
  // pointSeparation: distance between the label and point
  return {
    size: function (out, f) {
      out.cells = 6
      out.positions = 8
      out.bounds = 16
    },
    write: function (out, f) {
      var xmin, ymin, xmax, ymax
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
  }
}
