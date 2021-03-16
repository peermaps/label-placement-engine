module.exports = function lineIntersection(out, p0, p1, p2, p3) {
  var ax = p1[0] - p0[0]
  var ay = p1[1] - p0[1]
  var bx = p3[0] - p2[0]
  var by = p3[1] - p2[1]
  var d = ax*by - bx*ay
  if (d === 0) return null
  var dpos = d > 0
  var cx = p0[0] - p2[0]
  var cy = p0[1] - p2[1]
  var sn = ax*cy - ay*cx
  if ((sn < 0) === dpos) return null
  var tn = bx*cy - by*cx
  if (tn < 0 === dpos) return null
  if ((sn > d === dpos) || (tn > d === dpos)) return null
  var t = tn / d
  out[0] = p0[0] + t*ax
  out[1] = p0[1] + t*ay
  return out
}
