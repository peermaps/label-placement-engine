var polygonOverlap = require('./lib/polygon-overlap.js')
var bbox = [0,0,0,0]

module.exports = LabelMaker

function LabelMaker (opts) {
  if (!(this instanceof LabelMaker)) return new LabelMaker(opts)
  if (!opts) opts = {}
  this._cellType = opts.cellType || 'u16'
  this._types = opts.types || {}
  this._outlines = opts.outlines !== undefined ? opts.outlines : false
  this.data = {
    positions: null,
    cells: null,
    visible: null,
    labels: null,
    bounds: null,
    bbox: null,
    outlines: null
  }
  this.count = {
    positions: 0,
    cells: 0,
    bounds: 0,
    bbox: 0,
    outlines: 0
  }
  this._dst = {
    positions: { offset: 0, data: null },
    cells: { offset: 0, data: null },
    bounds: { offset: 0, data: null }
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
  if (!this.data.positions || plen > this.data.positions.length) {
    this.data.positions = new Float32Array(plen)
    this.data.labels = new Float32Array(plen/2)
    this.data.visible = new Float32Array(plen/2)
  } else {
    this.data.visible.fill(0)
  }
  if (!this.data.cells || clen > this.data.cells.length) {
    var F = {
      u16: Uint16Array,
      u32: Uint32Array
    }[this._cellType];
    if (!F) {
      throw new Error('cellType ' + this._cellType + ' not supported')
    }
    this.data.cells = new F(clen)
  }
  if (!this.data.bounds || blen > this.data.bounds.length) {
    this.data.bounds = new Float32Array(blen)
  }
  if (this._outlines && (!this.data.outlines || blen*2 > this.data.outlines.length)) {
    this.data.outlines = new Float32Array(blen*2)
  }
  if (!this.data.bbox || features.length * 4 > this.data.bbox.length) {
    this.data.bbox = new Float32Array(features.length*4)
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
  var plen = 0, clen = 0, ooffset = 0
  this._dst.positions.offset = 0
  this._dst.positions.data = this.data.positions
  this._dst.cells.offset = 0
  this._dst.cells.data = this.data.cells
  this._dst.bounds.offset = 0
  this._dst.bounds.data = this.data.bounds

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
        this.data.cells[j] += pstart/2
      }
      this._offsets.bounds[i*2+0] = bstart
      this._offsets.bounds[i*2+1] = bend

      bbox[0] = Infinity
      bbox[1] = Infinity
      bbox[2] = -Infinity
      bbox[3] = -Infinity
      for (var j = bstart; j < bend; j+=2) {
        bbox[0] = Math.min(bbox[0], this.data.bounds[j+0])
        bbox[1] = Math.min(bbox[1], this.data.bounds[j+1])
        bbox[2] = Math.max(bbox[2], this.data.bounds[j+0])
        bbox[3] = Math.max(bbox[3], this.data.bounds[j+1])
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
      this.data.bbox[i*4+0] = bbox[0]
      this.data.bbox[i*4+1] = bbox[1]
      this.data.bbox[i*4+2] = bbox[2]
      this.data.bbox[i*4+3] = bbox[3]

      if (visible) {
        for (var j = 0; j < i; j++) {
          if (j === i) continue
          if (this._visible[j] < 0.5) continue
          if (boxOverlap(i*4,this.data.bbox,j*4,this.data.bbox)) {
            var jbs = this._offsets.bounds[j*2+0]
            var jbe = this._offsets.bounds[j*2+1]
            if (polygonOverlap(bstart,bend,this.data.bounds,jbs,jbe,this.data.bounds)) {
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
        this.data.visible[j] = visible ? 1 : 0
        this.data.labels[j] = i
      }
    }
    if (this._outlines && this._visible[i] > 0.5) {
      var n = bend-bstart
      for (var j = 0; j < n; j+=2) {
        this.data.outlines[ooffset++] = this.data.bounds[bstart+j+0]
        this.data.outlines[ooffset++] = this.data.bounds[bstart+j+1]
        this.data.outlines[ooffset++] = this.data.bounds[bstart+(j+2)%n+0]
        this.data.outlines[ooffset++] = this.data.bounds[bstart+(j+2)%n+1]
      }
    }
  }

  this.count.positions = this._dst.positions.offset/2
  this.count.cells = this._dst.cells.offset
  this.count.bounds = this._dst.bounds.offset/2
  this.count.outlines = ooffset/2
}

function boxOverlap(ai, a, bi, b) {
  return a[ai+2] >= b[bi+0] && a[ai+0] <= b[bi+2]
    && a[ai+3] >= b[bi+1] && a[ai+1] <= b[bi+3]
}
