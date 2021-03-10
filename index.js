var tritri = require('robust-triangle-triangle-2d-intersect')
var tri0 = [[0,0],[0,0],[0,0]]
var tri1 = [[0,0],[0,0],[0,0]]
var bbox = [0,0,0,0]

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
    this._buffers.bbox = new Float32Array(features.length * 4)
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

    bbox[0] = Infinity
    bbox[1] = Infinity
    bbox[2] = -Infinity
    bbox[3] = -Infinity
    for (var j = bstart; j < bend; j+=2) {
      bbox[0] = Math.min(bbox[0], this._buffers.bounds[j+0])
      bbox[1] = Math.min(bbox[1], this._buffers.bounds[j+1])
      bbox[2] = Math.max(bbox[0], this._buffers.bounds[j+2])
      bbox[3] = Math.max(bbox[1], this._buffers.bounds[j+3])
    }
    this._buffers.bbox[i*4+0] = bbox[0]
    this._buffers.bbox[i*4+1] = bbox[1]
    this._buffers.bbox[i*4+2] = bbox[2]
    this._buffers.bbox[i*4+3] = bbox[3]

    var visible = true
    for (var j = cstart; j < cend; j+=3) {
      var c0 = this._buffers.cells[j+0]
      var c1 = this._buffers.cells[j+1]
      var c2 = this._buffers.cells[j+2]
      tri0[0][0] = this._buffers.positions[c0*2+0]
      tri0[0][1] = this._buffers.positions[c0*2+1]
      tri0[1][0] = this._buffers.positions[c1*2+0]
      tri0[1][1] = this._buffers.positions[c1*2+1]
      tri0[2][0] = this._buffers.positions[c2*2+0]
      tri0[2][1] = this._buffers.positions[c2*2+1]
      for (var k = 0; k < cstart; k+=3) {
        var c0 = this._buffers.cells[k+0]
        var c1 = this._buffers.cells[k+1]
        var c2 = this._buffers.cells[k+2]
        tri1[0][0] = this._buffers.positions[c0*2+0]
        tri1[0][1] = this._buffers.positions[c0*2+1]
        tri1[1][0] = this._buffers.positions[c1*2+0]
        tri1[1][1] = this._buffers.positions[c1*2+1]
        tri1[2][0] = this._buffers.positions[c2*2+0]
        tri1[2][1] = this._buffers.positions[c2*2+1]
        if (tritri(tri0,tri1)) {
          visible = false
          break
        }
      }
      if (!visible) break
    }
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
