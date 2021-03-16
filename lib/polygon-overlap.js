var pointInPolygon = require('point-in-polygon/flat')
var lineIntersection = require('./line-intersection.js')
var v0 = [0,0]
var v1 = [0,0]
var v2 = [0,0]
var v3 = [0,0]
var v4 = [0,0]

module.exports = function polygonOverlap(astart, aend, a, bstart, bend, b) {
  var alen = aend - astart
  for (var i = 0; i < alen; i+=2) {
    v0[0] = a[astart+i+0]
    v0[1] = a[astart+i+1]
    v1[0] = a[astart+(i+2)%alen+0]
    v1[1] = a[astart+(i+2)%alen+1]
    var blen = bend - bstart
    for (var j = 0; j < blen; j+=2) {
      v2[0] = b[bstart+j+0]
      v2[1] = b[bstart+j+1]
      v3[0] = b[bstart+(j+2)%blen+0]
      v3[1] = b[bstart+(j+2)%blen+1]
      if (lineIntersection(v4,v0,v1,v2,v3)) return true
    }
  }
  v0[0] = b[bstart+0]
  v0[1] = b[bstart+1]
  if (pointInPolygon(v0, a, astart, aend)) return true
  return false
}
