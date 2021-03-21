var defaultScale = [1,1]

module.exports = function (params) {
  if (!params) params = {}
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
      var scale = f.scale || params.scale || defaultScale

      var labelSize = f.labelSize || params.labelSize
      var labelSizeScale = f.labelSizeScale || params.labelSizeScale || scale
      var labelSize0 = labelSize[0]*labelSizeScale[0]
      var labelSize1 = labelSize[1]*labelSizeScale[1]

      var labelMargin = f.labelMargin || params.labelMargin
      var labelMarginScale = f.labelMarginScale || params.labelMarginScale || scale
      var labelMargin0 = labelMargin[0]*labelMarginScale[0]
      var labelMargin1 = labelMargin[1]*labelMarginScale[1]

      var pointMargin = f.pointMargin || params.pointMargin
      var pointMarginScale = f.pointMarginScale || params.pointMarginScale || scale
      var pointMargin0 = pointMargin[0]*pointMarginScale[0]
      var pointMargin1 = pointMargin[1]*pointMarginScale[1]

      var pointSize = f.pointSize || params.pointSize
      var pointSizeScale = f.pointSizeScale || params.pointSizeScale || scale
      var pointSize0 = pointSize[0]*pointSizeScale[0]
      var pointSize1 = pointSize[1]*pointSizeScale[1]

      var point = f.point || params.point
      var pointScale = f.pointScale || params.pointScale || scale
      var point0 = point[0]*pointScale[0]
      var point1 = point[1]*pointScale[1]

      if (out.index === 0) { // top
        xmin = point0 - labelSize0/2
        xmax = point0 + labelSize0/2
        ymin = point1 + pointMargin1
        ymax = point1 + pointMargin1 + labelSize1
        out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
        out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
        out.bounds.data[out.bounds.offset++] = point0 - pointSize0/2 - pointMargin0
        out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
        out.bounds.data[out.bounds.offset++] = point0 - pointSize0/2 - pointMargin0
        out.bounds.data[out.bounds.offset++] = point1 - pointSize1/2 - pointMargin1
        out.bounds.data[out.bounds.offset++] = point0 + pointSize0/2 + pointMargin0
        out.bounds.data[out.bounds.offset++] = point1 - pointSize1/2 - pointMargin1
        out.bounds.data[out.bounds.offset++] = point0 + pointSize0/2 + pointMargin0
        out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
        out.bounds.data[out.bounds.offset++] = xmax + labelMargin0
        out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
        out.bounds.data[out.bounds.offset++] = xmax + labelMargin0
        out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
        out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
        out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
      } else if (out.index === 1) { // bottom
        xmin = point0 - labelSize0/2
        xmax = point0 + labelSize0/2
        ymin = point1 - pointMargin1 - labelSize1
        ymax = point1 - pointMargin1
        out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
        out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
        out.bounds.data[out.bounds.offset++] = xmax + labelMargin0
        out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
        out.bounds.data[out.bounds.offset++] = xmax + labelMargin0
        out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
        out.bounds.data[out.bounds.offset++] = point0 + pointSize0/2 + pointMargin0
        out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
        out.bounds.data[out.bounds.offset++] = point0 + pointSize0/2 + pointMargin0
        out.bounds.data[out.bounds.offset++] = point1 + pointSize1/2 + pointMargin1
        out.bounds.data[out.bounds.offset++] = point0 - pointSize0/2 - pointMargin0
        out.bounds.data[out.bounds.offset++] = point1 + pointSize1/2 + pointMargin1
        out.bounds.data[out.bounds.offset++] = point0 - pointSize0/2 - pointMargin0
        out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
        out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
        out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
      } else if (out.index === 2) { // right
        xmin = point0 + pointSize0/2 + pointMargin0
        xmax = point0 + pointSize0/2 + pointMargin0 + labelSize0
        ymin = point1 - labelSize1/2
        ymax = point1 + labelSize1/2
        out.bounds.data[out.bounds.offset++] = point0 - pointSize0/2 - pointMargin0
        out.bounds.data[out.bounds.offset++] = point1 - pointSize1/2 - pointMargin1
        out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
        out.bounds.data[out.bounds.offset++] = point1 - pointSize1/2 - pointMargin1
        out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
        out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
        out.bounds.data[out.bounds.offset++] = xmax + labelMargin0
        out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
        out.bounds.data[out.bounds.offset++] = xmax + labelMargin0
        out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
        out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
        out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
        out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
        out.bounds.data[out.bounds.offset++] = point1 + pointSize1/2 + pointMargin1
        out.bounds.data[out.bounds.offset++] = point0 - pointSize0/2 - pointMargin0
        out.bounds.data[out.bounds.offset++] = point1 + pointSize1/2 + pointMargin1
      } else if (out.index === 3) { // left
        xmin = point0 - pointSize0/2 - pointMargin0 - labelSize0
        xmax = point0 - pointSize0/2 - pointMargin0
        ymin = point1 - labelSize1/2
        ymax = point1 + labelSize1/2
        out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
        out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
        out.bounds.data[out.bounds.offset++] = point0 - pointSize0/2 - pointMargin0
        out.bounds.data[out.bounds.offset++] = ymin - labelMargin1
        out.bounds.data[out.bounds.offset++] = point0 - pointSize0/2 - pointMargin0
        out.bounds.data[out.bounds.offset++] = point1 - pointSize1/2 - pointMargin1
        out.bounds.data[out.bounds.offset++] = point0 + pointSize0/2 + pointMargin0
        out.bounds.data[out.bounds.offset++] = point1 - pointSize1/2 - pointMargin1
        out.bounds.data[out.bounds.offset++] = point0 + pointSize0/2 + pointMargin0
        out.bounds.data[out.bounds.offset++] = point1 + pointSize1/2 + pointMargin1
        out.bounds.data[out.bounds.offset++] = point0 - pointSize0/2 - pointMargin0
        out.bounds.data[out.bounds.offset++] = point1 + pointSize1/2 + pointMargin1
        out.bounds.data[out.bounds.offset++] = point0 - pointSize0/2 - pointMargin0
        out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
        out.bounds.data[out.bounds.offset++] = xmin - labelMargin0
        out.bounds.data[out.bounds.offset++] = ymax + labelMargin1
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
    },
    params: params
  }
}
