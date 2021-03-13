var pointInPolygon = require('point-in-polygon')
var bbox = [0,0,0,0]
var v0 = [0,0]
var v1 = [0,0]
var v2 = [0,0]
var v3 = [0,0]
var v4 = [0,0]
var polygon = []

module.exports = LabelMaker

function LabelMaker (opts) {
  if (!(this instanceof LabelMaker)) return new LabelMaker(opts)
  this._cellType = opts.cellType || 'u16'
  this._types = opts.types || {}
  this.data = {
    positions: null,
    cells: null,
    visible: null,
    labels: null
  }
  this._buffers = {
    positions: null,
    cells: null,
    visible: null,
    labels: null,
    bounds: null,
    bbox: null
  }
  this._dst = {
    positions: { offset: 0, data: null },
    cells: { offset: 0, data: null },
    bounds: { offset: 0, data: null },
    state: null
  }
  this._visible = null
  this._offsets = { bounds: null }
  this._states = null
  this._size = { positions: 0, cells: 0, bounds: 0 }
}

LabelMaker.prototype.update = function (features) {
  this._features = features
  var plen = 0, clen = 0, blen = 0
  if (!this._states || this._states.length !== features.length) {
    this._states = Array(features.length)
  }
  for (var i = 0; i < features.length; i++) {
    var f = features[i]
    var t = this._types[f.type]
    if (!t) throw new Error('implementation not provided for type=' + f.type)
    this._size.positions = 0
    this._size.cells = 0
    this._size.bounds = 0
    t.size(this._size, features[i])
    plen += this._size.positions
    clen += this._size.cells
    blen += this._size.bounds
    this._states[i] = t.initialState
  }
  if (!this._buffers.positions || plen > this._buffers.positions.length) {
    this._buffers.positions = new Float32Array(plen)
    this._buffers.labels = new Float32Array(plen)
    this._buffers.visible = new Float32Array(plen)
  } else {
    this._buffers.visible.fill(0)
  }
  if (!this._buffers.cells || clen > this._buffers.cells.length) {
    var F = {
      u16: Uint16Array,
      u32: Uint32Array
    }[this._cellType];
    if (!F) {
      throw new Error('cellType ' + this._cellType + ' not supported')
    }
    this._buffers.cells = new F(clen)
  }
  if (!this._buffers.bounds || blen > this._buffers.bounds.length) {
    this._buffers.bounds = new Float32Array(blen)
  }
  if (!this._buffers.bbox || features.length * 4 > this._buffers.bbox.length) {
    this._buffers.bbox = new Float32Array(features.length*4)
  }
  if (!this._visible || this._visible.length !== features.length) {
    this._visible = new Float32Array(features.length)
  } else {
    this._visible.fill(0)
  }
  if (!this._offsets.bounds || features.length*2 > this._offsets.bounds.length) {
    this._offsets.bounds = new Float32Array(features.length*2)
  }
}

LabelMaker.prototype.step = function () {
  var plen = 0, clen = 0
  this._dst.positions.offset = 0
  this._dst.positions.data = this._buffers.positions
  this._dst.cells.offset = 0
  this._dst.cells.data = this._buffers.cells
  this._dst.bounds.offset = 0
  this._dst.bounds.data = this._buffers.bounds
  var updates = 0
  for (var i = 0; i < this._features.length; i++) {
    var f = this._features[i]
    var t = this._types[f.type]
    if (!t) throw new Error('implementation not provided for type=' + f.type)
    var pstart = this._dst.positions.offset
    var cstart = this._dst.cells.offset
    var bstart = this._dst.bounds.offset
    if (this._buffers.visible[pstart/2]) {
      t.size(this._size, this._features[i])
      this._dst.positions.offset += this._size.positions
      this._dst.cells.offset += this._size.cells
      this._dst.bounds.offset += this._size.bounds
      continue
    }
    updates++
    this._dst.state = this._states[i]
    t.write(this._dst, this._features[i])
    var pend = this._dst.positions.offset
    var cend = this._dst.cells.offset
    var bend = this._dst.bounds.offset
    for (var j = cstart; j < cend; j++) {
      this._buffers.cells[j] += pstart/2
    }

    this._offsets.bounds[i*2+0] = bstart
    this._offsets.bounds[i*2+1] = bend

    bbox[0] = Infinity
    bbox[1] = Infinity
    bbox[2] = -Infinity
    bbox[3] = -Infinity
    for (var j = bstart; j < bend; j+=2) {
      bbox[0] = Math.min(bbox[0], this._buffers.bounds[j+0])
      bbox[1] = Math.min(bbox[1], this._buffers.bounds[j+1])
      bbox[2] = Math.max(bbox[2], this._buffers.bounds[j+0])
      bbox[3] = Math.max(bbox[3], this._buffers.bounds[j+1])
    }
    var visible = true
    if (bstart === bend) {
      this._buffers.bbox[i*4+0] = 0
      this._buffers.bbox[i*4+1] = 0
      this._buffers.bbox[i*4+2] = 0
      this._buffers.bbox[i*4+3] = 0
      visible = false
    } else {
      this._buffers.bbox[i*4+0] = bbox[0]
      this._buffers.bbox[i*4+1] = bbox[1]
      this._buffers.bbox[i*4+2] = bbox[2]
      this._buffers.bbox[i*4+3] = bbox[3]
    }

    if (visible) {
      var ibs = this._offsets.bounds[i*2+0]
      var ibe = this._offsets.bounds[i*2+1]
      for (var j = 0; j < this._features.length; j++) {
        if (i === j) continue
        if (!this._visible[j]) continue
        if (this._buffers.bbox[j*4+0] === this._buffers.bbox[j*4+2]) {
          continue
        }
        if (boxOverlap(i*4,this._buffers.bbox,j*4,this._buffers.bbox)) {
          var jbs = this._offsets.bounds[j*2+0]
          var jbe = this._offsets.bounds[j*2+1]
          if (polygonOverlap(ibs,ibe,this._buffers.bounds,jbs,jbe,this._buffers.bounds)) {
            visible = false
            break
          }
        }
      }
    }
    this._visible[i] = visible

    for (var j = pstart/2; j < pend/2; j++) {
      this._buffers.visible[j] = visible ? 1 : 0
      this._buffers.labels[j] = i
    }
    if (this._dst.state !== undefined) {
      this._states[i] = this._dst.state
    } else if (this._states[i] !== undefined) {
      this._states[i] = undefined
    }
  }

  if (!this.data.positions || this.data.positions.length !== pend) {
    this.data.positions = this._buffers.positions.subarray(0,pend)
    this.data.visible = this._buffers.visible.subarray(0,pend/2)
    this.data.labels = this._buffers.labels.subarray(0,pend/2)
  }
  if (!this.data.cells || this.data.cells.length !== cend) {
    this.data.cells = this._buffers.cells.subarray(0,cend)
  }
  return updates
}

function boxOverlap(ai, a, bi, b) {
  return a[ai+2] >= b[bi+0] && a[ai+0] <= b[bi+2]
    && a[ai+3] >= b[bi+1] && a[ai+1] <= b[bi+3]
}

function polygonOverlap(astart, aend, a, bstart, bend, b) {
  var alen = aend - astart
  for (var i = 0; i < alen; i+=2) {
    v0[0] = a[astart+i+0]
    v0[1] = a[astart+i+1]
    v1[0] = a[astart+(i+1)%alen+0]
    v1[1] = a[astart+(i+1)%alen+1]
    var blen = bend - bstart
    for (var j = 0; j < blen; j+=2) {
      v2[0] = b[bstart+j+0]
      v2[1] = b[bstart+j+1]
      v3[0] = b[bstart+(j+1)%blen+0]
      v3[1] = b[bstart+(j+1)%blen+1]
      if (lineIntersection(v4,v0,v1,v2,v3)) return true
    }
  }
  if (polygon.length != alen/2) {
    polygon = new Array(alen/2)
    for (var i = 0; i < alen/2; i++) {
      polygon[i] = [0,0]
    }
  }
  for (var i = 0; i < alen/2; i++) {
    polygon[i][0] = a[astart+i*2+0]
    polygon[i][1] = a[astart+i*2+1]
  }
  v0[0] = b[bstart+0]
  v0[1] = b[bstart+1]
  if (pointInPolygon(v0, polygon)) return true
  return false
}

function lineIntersection(out, p0, p1, p2, p3) {
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
