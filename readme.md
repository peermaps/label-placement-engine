# label-placement-engine

build and update simplicial complex geometry for 2d label placement

Labels have many valid configurations and can set additional constraints such as a margin distance
but they may never overlap another label.

# example

view [a graphical example](https://substack.net/wip/label2.html) and resize the window to see how the
labels adjust

or this example creates some labels and displays 2 ways or getting at the geometry created:

``` js
// initialize with presets
var labelEngine = require('label-placement-engine')({
  types: {
    point: require('../preset/point')({
      labelMargin: [10,10],
      pointSize: [10,10],
      pointMargin: [10,10],
      pointSeparation: [10,10],
    }),
  }
})

// build label data for preset types
var labels = []
for (var i = 0; i < 20; i++) {
  var x = Math.random()*250, y = Math.random()*250
  labels.push({
    type: 'point',
    labelSize: [50,15],
    point: [x,y]
  })
}
labelEngine.update(labels)

// loop to get data for individual labels
for (var i = 0; i < labels.length; i++) {
  if (labelEngine.isVisible(i)) {
    var pstart = labelEngine.offsets.positions[i*2+0]
    var pend = labelEngine.offsets.positions[i*2+1]
    console.log(i, labelEngine.data.positions.slice(pstart, pend))
  }
}

// or large slices for rendering
console.log({
  positions: labelEngine.data.positions.subarray(0, labelEngine.count.positions),
  cells: labelEngine.data.cells.subarray(0, labelEngine.count.cells),
})
```

# api

```
var LabelEngine = require('label-placement-engine')
var presets = {
  point: require('label-placement-engine/preset/point'),
  line: require('label-placement-engine/preset/line'),
  area: require('label-placement-engine/preset/area'),
  bbox: require('label-placement-engine/preset/bbox'),
}
```

## var engine = LabelEngine(opts)

* `opts.types` - object mapping a type name to a geometry function (see below)
* `opts.cellType` - element default: `'u16'`
* `opts.outlines` - when `true`, generate `engine.data.lines` suitable for line rendering,
  tracing around the perimeter of each feature used for collisions
* `opts.maxIndex` - maximum number of label iterations (default: 50)

Preset geometry functions to pass in as `opts.types` are provided in the `preset/` directory of this
package.

### geometry functions

Each geometry function receives the label object provided to `engine.update()` and the function
should return an object `res` with:

* `res.size(out, label)` - write out the maximum item length this function will need to calculate
  geometry by adding to `out.cells`, `out.positions`, and `out.bounds`.
* `res.write(out, label)` - write geometry data for the `label` into `out.bounds.data`,
  `out.positions.data`, and `out.cells.data` incrementing `out.bounds.offset`,
  `out.positions.offset`, and `out.cells.offset` respectively.

The `res.write()` function may be called multiple times where `out.index` is incremented each time
starting at 0 to generate new candidate functions in the case of overlapping geometry.

The bounds data is used as a quicker first-pass for collision detection before running a more
expensive polygon intersection algorithm.

## engine.update(labels)

Build label geometry for `labels`, an array of `label` data. Each `label` has a `label.type` that
maps to one of the `opts.types` that the `engine` was created with.

The label geometry is written to `engine.data` and `engine.count`. 

## engine.isVisible(index)

Return `true` if `labels[index]` is visible in the output for the array of `labels` last provided to
the `update()` method.

## engine.data

* `engine.data.bounds` - Float32Array of xmin,ymin,xmax,ymax coordinate data that describes the
  bounding geometry of each item
* `engine.data.positions` - Float32Array of x,y coordinate pairs for the geometry
* `engine.data.cells` - Uint16Array or Uint32Array (depending on `opts.cellType`) of indexes into
  the positions array
* `engine.data.outlines` - Float32Array of x,y coordinate data suitable for gl line rendering.
  only set when `opts.outlines` is `true`

## engine.count

The `engine.data` arrays are allocated to the maximum size that could be needed but the actual size
is often less than this maximum amount. Use `engine.count` to use the actual size of the geometry.

* `engine.count.bounds`
* `engine.count.positions`
* `engine.count.cells`
* `engine.count.outlines`

## engine.offsets

If you want to get at the offsets into the `engine.data` for bounds and positions for a given index
into the last `labels` array passed to the `update()` method, use the corresponding
record in `engine.offsets`.

* `engine.offsets.bounds`
* `engine.offsets.positions`

These are useful if you have other vertex attributes to assign for your shaders.

# install

```
npm install label-placement-engine
```

# license

bsd
