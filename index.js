var polygonOverlap = require('./lib/polygon-overlap.js')
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
  this.count = {
    positions: 0,
    cells: 0,
    visible: 0,
    labels: 0,
    bounds: 0,
    bbox: 0
  }
  this._dst = {
    positions: { offset: 0, data: null },
    cells: { offset: 0, data: null },
    bounds: { offset: 0, data: null },
    state: null
  }
  this._visible = null
  this._offsets = { bounds: null, positions: null, cells: null }
  this._size = { positions: 0, cells: 0, bounds: 0 }
}

LabelMaker.prototype.update = function (features) {
  this._features = features
  var plen = 0, clen = 0, blen = 0
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
  }
  if (!this._buffers.positions || plen > this._buffers.positions.length) {
    this._buffers.positions = new Float32Array(plen)
    this._buffers.labels = new Float32Array(plen/2)
    this._buffers.visible = new Float32Array(plen/2)
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
  if (!this._offsets.positions || features.length*2 > this._offsets.positions.length) {
    this._offsets.positions = new Float32Array(features.length*2)
  }
  if (!this._offsets.cells || features.length*2 > this._offsets.cells.length) {
    this._offsets.cells = new Float32Array(features.length*2)
  }
  this._step()
}

LabelMaker.prototype._step = function () {
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

    this._dst.index = 0
    var found = false
    while (!found) {
      this._dst.positions.offset = pstart
      this._dst.cells.offset = cstart
      this._dst.bounds.offset = bstart
      t.write(this._dst, this._features[i])
      this._dst.index++
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
        bbox[0] = Infinity
        bbox[1] = Infinity
        bbox[2] = Infinity
        bbox[3] = Infinity
        visible = false
        found = true // no solution
      }
      this._buffers.bbox[i*4+0] = bbox[0]
      this._buffers.bbox[i*4+1] = bbox[1]
      this._buffers.bbox[i*4+2] = bbox[2]
      this._buffers.bbox[i*4+3] = bbox[3]

      if (visible) {
        for (var j = 0; j < i; j++) {
          if (j === i) continue
          if (this._visible[j] < 0.5) continue
          if (boxOverlap(i*4,this._buffers.bbox,j*4,this._buffers.bbox)) {
            var jbs = this._offsets.bounds[j*2+0]
            var jbe = this._offsets.bounds[j*2+1]
            if (polygonOverlap(bstart,bend,this._buffers.bounds,jbs,jbe,this._buffers.bounds)) {
              visible = false
              break
            }
          }
        }
      }
      this._visible[i] = visible
      if (visible) {
        found = true
      }
    }
    if (this._visible[i] < 0.5) {
      this._dst.positions.offset = pstart
      this._dst.cells.offset = cstart
      this._dst.bounds.offset = bstart
      this._offsets.bounds[i*2+0] = bstart
      this._offsets.bounds[i*2+1] = bstart
    } else {
      for (var j = pstart/2; j < pend/2; j++) {
        this._buffers.visible[j] = visible ? 1 : 0
        this._buffers.labels[j] = i
      }
    }
  }

  var pend = this._dst.positions.offset
  if (!this.data.positions || this.data.positions.length !== pend) {
    this.data.positions = this._buffers.positions.subarray(0,pend)
    this.data.visible = this._buffers.visible.subarray(0,pend/2)
    this.data.labels = this._buffers.labels.subarray(0,pend/2)
  }
  var cend = this._dst.cells.offset
  if (!this.data.cells || this.data.cells.length !== cend) {
    this.data.cells = this._buffers.cells.subarray(0,cend)
  }
  var bend = this._dst.bounds.offset
  if (!this.data.bounds || this.data.bounds.length !== bend) {
    this.data.bounds = this._buffers.bounds.subarray(0,bend)
  }
  return updates
}

function boxOverlap(ai, a, bi, b) {
  return a[ai+2] >= b[bi+0] && a[ai+0] <= b[bi+2]
    && a[ai+3] >= b[bi+1] && a[ai+1] <= b[bi+3]
}
