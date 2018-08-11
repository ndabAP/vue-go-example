/*! Contour-Geo - v1.0.1 - 2015-09-11 */

(function(exports, global) {
    global["true"] = exports;
    (function() {
        Contour.geo = Contour.geo || {};
        var isGeoPointsArray = function(data) {
            return _.isArray(data) && _.isArray(data[0]) && data[0].length === 2 && _.all(data[0], _.isNumber);
        };
        /**
    * Provides a geographical 'frame' for the Contour instance. 
    *
    * This is required for all visualizations displayed in a geographical format -- maps, choropleths, specialized small-states callouts, etc. (Adding `.geo` to your Contour instance is loosely analogous to adding `.cartesian()`, which supplies the Cartesian frame for bar, line, and area charts.)
    *
    * ###Example:
    *
    *   d3.json('world.json', function(mapUnit) {
    *       new Contour({
    *           el: '.myMap'
    *       })
    *       .geo()
    *       .map(mapUnit, {center: [-122, 37]})
    *       .render();
    *   })
    *
    * @function geo
    */
        Contour.expose("geo", function() {
            return {
                dataNormalizer: function(data, categories) {
                    // check if data is geographical data, if so, normalizer it that way
                    // otherwise use the default normalizer
                    if (isGeoPointsArray(data)) {
                        // array of tuples-> assume we have an array of longitues and lattitues
                        return data;
                    } else {
                        // use default normalizer
                        return _.nw.normalizeSeries.apply(this, arguments);
                    }
                },
                isSupportedDataFormat: function(data) {
                    return !isGeoPointsArray(data) && _.nw.isSupportedDataFormat(data);
                }
            };
        });
    })();
    (function() {
        "use strict";
        var defaults = {
            map: {
                // topoJson feature to render as a map (will acccess topoJson.objects[options.feature])
                feature: "all",
                // scale to be used by the projection,
                // if left undefined, scale will be chart.plotWidth * scaleRatio
                scale: undefined,
                // a nice scale ratio
                scaleRatio: 1.3333,
                // valid options are at https://github.com/mbostock/d3/wiki/Geo-Projections
                projection: d3.geo.mercator(),
                // array of [longitute, latitude]
                center: undefined,
                // d3.geo.projection.precision()
                precision: .1,
                // translates the pixel coordinates of center based on array of [x, y]
                translation: undefined,
                // a class name or function that returns a class name to be set onto each feature
                cssClass: undefined,
                // a color (hex) or function that returns a color to be set onto each feature
                fill: undefined
            }
        };
        /**
    * Adds a map visualization to the Contour instance.
    *
    * This visualization requires the [`.geo()`](#geo) frame.
    *
    * Map visualizations require a TopoJSON file with the topology to draw. Because of this, typically map visualizations are created as part of a callback function passed to a `d3.json()` call that parses the TopoJSON file. 
    *
    * When you [download Contour-Geo](get_contour.html), a few TopoJSON files are included. You can also [create your own](#topojson).
    *
    * ### Example:
    *
    *       d3.json('us-states.json', function (us) {
    *           new Contour({
    *                   el: '.map',
    *                   map: {
    *                       projection: d3.geo.albersUsa()
    *                   }
    *               })
    *               .geo()
    *               .map(us)
    *               .render();
    *       });
    *
    *
    * @name map(data, options)
    * @param {object} data The data (topology) to be rendered with this visualization. This must be in TopoJSON format.
    * @param {object} options (Optional) Configuration options particular to this visualization that override the defaults.
    */
        function map(data, layer, options) {
            var width = options.chart.plotWidth;
            var height = options.chart.plotHeight;
            var opt = options.map || {};
            var us = data;
            var fillFn = !opt.fill ? _.noop : _.isFunction(opt.fill) ? opt.fill : function() {
                return opt.fill;
            };
            var classFn = !opt.cssClass ? _.noop : _.isFunction(opt.cssClass) ? opt.cssClass : function() {
                return opt.cssClass;
            };
            var scaleRatio = options.map.scaleRatio;
            var projection = options.map.projection.scale(options.map.scale || width * scaleRatio).translate(options.map.translation || [ width / 2, height / 2 ]).precision(options.map.precision);
            if (projection.center) {
                projection.center(options.map.center || [ 0, 0 ]);
            }
            var path = d3.geo.path().projection(projection);
            var g = layer;
            g.append("g").attr("id", options.map.feature).selectAll("path").data(topojson.feature(us, us.objects[options.map.feature]).features).enter().append("path").attr("id", function(d) {
                return d.id;
            }).attr("class", function(d) {
                return "tooltip-tracker state " + classFn(d);
            }).attr("fill", fillFn).attr("d", path);
            g.append("path").datum(topojson.mesh(us, us.objects[options.map.feature]), function(a, b) {
                return a !== b;
            }).attr("id", "state-borders").attr("d", path);
        }
        map.defaults = defaults;
        Contour.export("map", map);
    })();
    (function() {
        "use strict";
        var defaults = {};
        var choropleth = function(data, layer, options) {
            this.ensureDefaults(options, "map");
            options.map = options.map || {};
            _.merge(options.map, options.choropleth);
            return this.map.renderer.call(this, data, layer, options);
        };
        choropleth.defaults = defaults;
        // don't add to output documentation until this is different from map.js
        Contour.export("choropleth", choropleth);
    })();
    (function() {
        "use strict";
        var shapes = {
            circle: function(data, layer, options) {
                var projection = options.map.projection;
                return layer.append("circle").attr("cx", function(d) {
                    return projection(d)[0];
                }).attr("cy", function(d) {
                    return projection(d)[1];
                }).attr("r", options.marker.size / 2 + "px").attr("fill", options.marker.fill);
            },
            triangle: function(data, layer, options) {
                var projection = options.map.projection;
                var size = options.marker.size;
                var points = [ -.5, 0, 0, -1, .5, 0 ].map(function(p) {
                    return p * size;
                }).join(" ");
                return layer.append("polyline").attr("transform", function(d) {
                    var proj = projection(d);
                    return "translate(" + proj[0] + "," + proj[1] + ")";
                }).attr("points", points).attr("fill", options.marker.fill);
            }
        };
        var defaults = {
            marker: {
                // size of the marker (it may mean different things for different shapes)
                size: 10,
                // shape of the marker
                shape: shapes.circle,
                // a class name or function that returns a class name to be set onto each feature
                cssClass: undefined,
                fill: undefined
            }
        };
        function render(data, layer, options) {
            var shapeRenderer = typeof options.marker.shape === "string" ? shapes[options.marker.shape] : options.marker.shape;
            // add shape to layer
            var sel = layer.selectAll(".geo-marker").data(data);
            var cssFn = function(add) {
                return function(d, i, j) {
                    var extraClasses = typeof add === "function" ? add.call(this, d, i, j) : add ? add : "";
                    return "geo-marker " + extraClasses;
                };
            };
            sel.enter().call(_.partialRight(_.partial(shapeRenderer, data), options));
            sel.attr("class", cssFn(options.marker.cssClass));
            sel.exit().remove();
        }
        render.defaults = defaults;
        render.shapes = shapes;
        /**
    * Adds one or more marker visualizations to the Contour instance. Markers allow you to add small shapes (circles or triangles) to your map, for example to indicate features of interest.
    *
    * The first argument to the visualization is an array of [longitude, latitude] pairs where the markers should appear.
    *
    * Longitude and latitude are specified in degrees.
    *
    * * Longitude is positive for East, negative for West.
    * * Latitude is positive for North, negative for South.
    *
    * This visualization requires the [`.geo()`](#geo) frame.
    *
    * To override any of the default configuration options in a maker, include the `marker` configuration object in the configuration options that you pass to your Contour constructor, or in the configuration object passed to the particular marker visualization.
    *
    * ### Example:
    *
    *       d3.json('us-states.json', function (mapUnit) {
    *           new Contour({
    *                   el: '.map',
    *                   marker: {
    *                       fill: '#0000ff'
    *                   }
    *               })
    *               .geo()
    *               .USMap(mapUnit)
    *               .marker([[-122, 37], [-87, 41]], {shape: 'circle'})
    *               .marker([[-120, 39]], {shape: 'triangle'})
    *               .render();
    *       });
    *
    *
    * @name marker(data, options)
    * @param {object} data The data (coordinates) describing where to render with this visualization on the `.map()`.
    * @param {object} options (Optional) Configuration options particular to this visualization that override the defaults.
    */
        Contour.export("marker", render);
    })();
    (function() {
        "use strict";
        /**
    * Adds callouts for several of the smaller states on the East Coast of the US.
    *
    * This visualization requires the [`.geo()`](#geo) frame.
    *
    * This visualization requires [`.map()`](#map) and a [`projection`](#geo_config/config.map.projection) of `albers` or `albersUsa`. It is suitable for use with the default `us.json` and `us-all.json` TopoJSON files included with Contour-Geo. 
    *
    * ### Example:
    *
    *       d3.json('us-all.json', function (us) {
    *           new Contour({ el: '.map' })
    *               .geo()
    *               .map(us, { projection: d3.geo.albersUsa() })
    *               .smallStatesCallouts()
    *               .render()
    *       });
    *
    * @name smallStatesCallouts(data, options)
    * @param {object} data The data (topology) to be rendered with this visualization. This must be in TopoJSON format. By default takes the data from the map that is also part of this Contour instance.
    * @param {object} options (Optional) Configuration options particular to this visualization that override the defaults.
    */
        Contour.export("smallStatesCallouts", function(data, layer, options) {
            var smallStates = [ "NH", "VT", "MA", "RI", "CT", "NJ", "DE", "MD" ];
            var width = options.chart.plotWidth;
            var height = options.chart.plotHeight;
            var scaleRatio = options.map.scaleRatio;
            var projection = d3.geo.albersUsa().scale(options.map.scale || width * scaleRatio).translate([ width / 2, height / 2 ]);
            var path = d3.geo.path().projection(projection);
            var getCentroid = function(element) {
                var bbox = element.getBoundingClientRect();
                return [ bbox.left + bbox.width / 2, bbox.top + bbox.height / 2 ];
            };
            var map = this.svg.select("#states");
            var rectHeight = 20;
            var rectWidth = 20;
            var rectPadding = 5;
            var offsetY = 70;
            function newCallout(d, index) {
                var node = d3.select(this);
                var origState = map.select("#" + d);
                var origClass = origState.attr("class");
                var origFill = origState.attr("fill");
                var origStroke = origState.attr("stroke");
                var centroid = path.centroid(origState.node().__data__);
                var line = node.append("line").attr("x1", centroid[0]).attr("y1", centroid[1]);
                var textBox = node.append("g").attr("transform", function() {
                    return "translate(" + (width - rectWidth) + "," + (offsetY + rectHeight * index + (rectPadding - 1) * index) + ")";
                });
                var tbCentroid = getCentroid(textBox.node());
                line.attr("x2", tbCentroid[0]).attr("y2", tbCentroid[1]);
                textBox.append("rect").datum(origState.node().__data__).attr("x", 0).attr("y", 0).attr("width", rectWidth).attr("height", rectHeight).attr("class", origClass).attr("fill", origFill).attr("stroke", origStroke);
                textBox.append("text").text(d).attr("y", rectHeight / 2).attr("dy", ".31em").attr("x", rectWidth / 2);
            }
            var g = layer.selectAll(".small-state-callout").data(smallStates);
            g.enter().append("g").attr("class", "small-state-callout").each(newCallout);
        });
    })();
    (function() {
        "use strict";
        var renderer = function(data, layer, options) {
            this.ensureDefaults(options, "map");
            options.choropleth = options.choropleth || {};
            _.merge(options.choropleth, {
                projection: d3.geo.albersUsa(),
                feature: "states"
            }, options.USMap);
            return this.choropleth.renderer.call(this, data, layer, options);
        };
        /**
    * Adds a map visualization to the Contour instance, using the `albersUsa` projection and a TopoJSON file with data on US states, such as the `us.json` and `us-all.json` TopoJSON files included with Contour-Geo. 
    *
    * This visualization requires the [`.geo()`](#geo) frame.
    * 
    * This visualization is a shorthand for configuring a [`.map()`](#map) visualization that is focused on the US.
    *
    * ### Example:
    *
    *       d3.json('us-all.json', function (us) {
    *           new Contour({ el: '.map' })
    *               .geo()
    *               .USMap(us)
    *               .render()
    *       });
    *
    * @name USMap(data, options)
    * @param {object} data The data (topology) to be rendered with this visualization. This must be in TopoJSON format.
    * @param {object} options (Optional) Configuration options particular to this visualization that override the defaults.
    */
        Contour.export("USMap", renderer);
    })();
    Contour.geo.version = "1.0.1";
    (function() {
        "use strict";
        var renderer = function(data, layer, options) {
            this.ensureDefaults(options, "map");
            var w = options.chart.plotWidth;
            var h = options.chart.plotHeight;
            // use miller projection if its available.
            // needs to include <script src="http://d3js.org/d3.geo.projection.v0.min.js" charset="utf-8"></script>
            // https://github.com/d3/d3-geo-projection
            options.choropleth = options.choropleth || {};
            _.merge(options.choropleth, {
                feature: "all",
                projection: (d3.geo.miller || d3.geo.equirectangular)(),
                scale: (w + 1) / 2 / Math.PI,
                precision: .1,
                translation: [ w / 2, h / 2 ]
            }, options.worldChoropleth);
            return this.choropleth.renderer.call(this, data, layer, options);
        };
        /**
    * Adds a map visualization to the Contour instance, using the `miller` projection if available (include `<script src="http://d3js.org/d3.geo.projection.v0.min.js" charset="utf-8"></script>`), or the `equirectangular` projection otherwise, and a TopoJSON file with data on world countries such as the `world.json` TopoJSON file included with Contour-Geo.
    *
    * This visualization requires the [`.geo()`](#geo) frame.
    *
    * This visualization is a shorthand for configuring a [`.map()`](#map) visualization for the world.
    *
    * ### Example:
    *
    *       d3.json('world.json', function (world) {
    *           new Contour({ el: '.map' })
    *               .geo()
    *               .worldMap(world)
    *               .render()
    *       });
    *
    * @name worldMap(data, options)
    * @param {object} data The data (topology) to be rendered with this visualization. This must be in TopoJSON format.
    * @param {object} options (Optional) Configuration options particular to this visualization that override the defaults.
    */
        Contour.export("worldMap", renderer);
    })();
})({}, function() {
    return this;
}());
//# sourceMappingURL=contour.geo.js.map