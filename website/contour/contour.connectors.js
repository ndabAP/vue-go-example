(function () {
    'use strict';

    function inherit(C, P) {
        var F = function () {};
        F.prototype = P.prototype;
        C.prototype = new F();
        C.__super__ = P.prototype;
        C.prototype.constructor = C;
    }

    /**
    * Shallow copy of an object
    */
    Contour.extend = function (dest /*, var_args*/) {
        var obj = Array.prototype.slice.call(arguments, 1);
        var current;
        for (var j=0; j<obj.length; j++) {
            if (!(current = obj[j])) continue;
            for (var key in current) {
                dest[key] = current[key];
            }
        }

        return dest;
    };

    /**
    /* Inherit from a class (using prototype borrowing)
    */
    Contour.extendClass = function (props, staticProps) {
        var parent = this;
        var child;

        child = props && props.hasOwnProperty('constructor') ? props.constructor : function () { return parent.apply(this, arguments); };

        // add static properties to the child constructor function
        Contour.extend(child, parent, staticProps);

        // associate prototype chain
        inherit(child, parent);

        // add instance properties
        if (props) Contour.extend(child.prototype, props);

        // done
        return child;
    };


})();

(function () {
    'use strict';

    /* define the Contour namespace */
    Contour = Contour || {};
    Contour.connectors = Contour.connectors || {};


    /* define a base class for all Contour components to inherit common functionality */
    Contour.Base = function () {};
    Contour.Base.extend = Contour.extendClass;

})();

(function () {
    'use strict';

    /**
    * ##Connectors
    * 
    * Data connectors allow you to connect your visualizations to source data in different formats, including CSV (comma-separated values), TSV (tab-separated values), and JSON.
    * 
    * All data connectors include several selectors for dimensions and measures, and for filtering data sets.
    **/

    Contour.connectors.ConnectorBase = Contour.Base.extend({
        initialize: function () {
        },

        fetch: function (url, callback) {
            var _this = this;

            return d3.text(url, function (data) {
                _this.parse(data);
                if (callback) callback.call(_this, data);
            });
        },

        /**
        * Returns the list of all posible dimensions for the data set. Dimensions are any non-numeric data.
        *
        * ### Example:
        *
        *       var csvData = 'quarter,region,cost,revenue,profit\n2013Q1,North,100,150,50\n2013Q1,South,200,250,50\n2013Q2,North,110,150,40\n2013Q2,South,220,250,30\n2013Q3,North,90,180,90\n2013Q3,South,115,180,65\n2013Q4,North,105,190,85\n2013Q3,South,90,180,90';
        *       var csv = new Contour.connectors.Csv(csvData);
        *
        *       csv.getDimensions(); // returns array ["quarter", "region"]
        *
        * @function getDimensions
        * @return {array} Array of dimensions for this data set.
        */
        getDimensions: function () {
            if (!this._data.length) return this._headers[0];
            var dimensions = [];
            var sampleRow = this._data[1];

            _.each(this._headers, function (header, index) {
                if (_.isNaN(+sampleRow[index].trim())) {
                    dimensions.push(header);
                }

            }, this);

            return dimensions;
        },

        /**
        * Returns the list of all posible measures for the data set.
        *
        * ### Example:
        *
        *       var csvData = 'quarter,cost,revenue,profit\n2013Q1,100,150,50\n2013Q2,110,150,40\n2013Q3,90,180,90\n2013Q4,105,190,85'
        *       var csv = new Contour.connectors.Csv(csvData);
        *
        *       csv.getMeasures(); // returns array ["cost", "revenue", "profit"]
        *
        * @function getMeasures
        * @return {array} Array of measures for this data set.
        */
        getMeasures: function () {
            var measures = [];
            var sampleRow = this._data[1];

            _.each(this._headers, function (header, index) {
                if (!_.isNaN(+sampleRow[index].trim())) {
                    measures.push(header);
                }

            }, this);

            return measures;
        },

        /**
        * Specifies the dimension to be used when passing this data set to a Contour visualization. Dimensions are any non-numeric data.
        *
        * ### Example:
        *
        *       var csvData = 'quarter,region,cost,revenue,profit\n2013Q1,North,100,150,50\n2013Q1,South,200,250,50\n2013Q2,North,110,150,40\n2013Q2,South,220,250,30\n2013Q3,North,90,180,90\n2013Q3,South,115,180,65\n2013Q4,North,105,190,85\n2013Q4,South,90,180,90';
        *       var csv = new Contour.connectors.Csv(csvData);
        *
        *       new Contour({
        *           el: '.myChart',
        *           xAxis: { title: 'Region' },
        *           yAxis: { title: 'Profit ($)' }
        *       })
        *       .cartesian()
        *       .column(csv.dimension('region').measure('profit'))
        *       .render();
        *
        * @function dimension
        * @param {string} string The name of the column to be used as the dimension for the data set.
        */
        dimension: function (_) {
            if(!arguments.length) return this._headers[this._dimension];

            if (typeof _ === 'function') {
                this._dimension = _;
            } else {
                this._dimension = this._headers.indexOf(_.toLowerCase().trim());
            }

            return this;
        },

        /**
        * Specifies a filter for the data set.
        *
        * If the parameter is an object, the object will be used as a 'match' for each row in the data set.
        * For example, `{ region: 'North' }` filters out any rows that do not have 'North' in the column 'region'.
        *
        * This can also be a filter function. The filter function will receive each row in the dataset,
        * and should return true if the row should be included in the final data, or false otherwise.
        *
        * ### Example:
        *
        *       var csvData = 'quarter,region,cost,revenue,profit\n2013Q1,North,100,150,50\n2013Q1,South,200,250,50\n2013Q2,North,110,150,40\n2013Q2,South,220,250,30\n2013Q3,North,90,180,90\n2013Q3,South,115,180,65\n2013Q4,North,105,190,85\n2013Q4,South,90,180,90';
        *       var csv = new Contour.connectors.Csv(csvData);
        *
        *       new Contour({
        *           el: '.myChart',
        *           xAxis: { title: 'Quarter' },
        *           yAxis: { title: 'Profit ($)' }
        *       })
        *       .cartesian()
        *       .column(csv.dimension('quarter').filter({region: 'North'}).measure('profit'))
        *       .render();
        *
        * @function filter
        * @param {function|object} criteria The function which returns true for each row to include, or the object which matches each row to include.
        */
        filter: function (criteria) {
            if (typeof criteria === 'function') {
                this._filterSelector = selector;
            } else {

                this._filterSelector = function (row) {
                    for(var key in criteria) {
                        var index = this._headers.indexOf(key);
                        if (index >= 0 && row[index] !== criteria[key])
                            return false;
                    }

                    return true;
                };
            }

            return this;
        },

        newMeasure: function (name, fn) {
            this._newMeasure = {
                name: name,
                fn: fn,
                index: this._headers.length
            };

            return this;
        },

        _rollup: function (data, dimension) {
            var rows = {};
            var hashEntry;
            var needsReduce = false;
            var _this = this;
            var dimKey = function (d, i) { return typeof dimension === 'function' ? dimension.call(_this, d, i) : d[dimension]; };

            // map
            _.each(data, function (d, i) {
                var key = dimKey(d, i);
                if (!(hashEntry = rows[key])) {
                    rows[key] = hashEntry = [];
                }

                hashEntry.push(d);
                needsReduce = hashEntry.length > 1;
            });

            if (!needsReduce) {
                return data;
            }

            // reduce
            var reduced = [];
            var gr = [];

            var reducer = function (row) {
                _.each(row, function (entry, i) {
                    if (i !== dimension && !_.isNaN(+entry)) {
                        var val = +entry;
                        gr[i] = (gr[i] || 0) + val;
                    } else {
                        gr[i] = gr[i] || entry;
                    }
                });
            };

            for (var key in rows) {
                gr = [];
                _.each(rows[key], reducer);
                reduced.push(gr);
            }

            return reduced;
        },

        /**
        * Returns the data set for the specificied measure.
        *
        * ### Example:
        *
        *       var csvData = 'quarter,region,cost,revenue,profit\n2013Q1,North,100,150,50\n2013Q1,South,200,250,50\n2013Q2,North,110,150,40\n2013Q2,South,220,250,30\n2013Q3,North,90,180,90\n2013Q3,South,115,180,65\n2013Q4,North,105,190,85\n2013Q4,South,90,180,90';
        *       var csv = new Contour.connectors.Csv(csvData);
        *
        *
        *       new Contour({
        *           el: '.myChart',
        *           xAxis: { title: 'Region' },
        *           yAxis: { title: 'Profit ($)' }
        *       })
        *       .cartesian()
        *       .column(csv.dimension('region').measure('profit'))
        *       .render();
        *
        * @function measure
        * @param {string|array} name The column name of the measure (case-insensitive). If it is an array,
        *  each measure will result in a chart series.
        * @param {array} extras (optional) An array of extra columns to be included in the data set (useful for including extra dimensions).
        * @return {array} Normalized data set, to be passed to a Contour visualization.
        */
        measure: function (name, extras) {
            name = _.isArray(name) ? name : [name];
            var lowerCase = function (x) { return x.toLowerCase().trim(); }

            return this.data(_.map(name, lowerCase), _.map(extras, lowerCase));
        },

        /**
        * Returns only the top `t` results from the sorted data set. Call this after you have specified dimensions and/or filters but before you have called `.measure()`.
        *
        * ### Example:
        *
        *       var csvData = 'quarter,region,cost,revenue,profit\n2013Q1,North,100,150,50\n2013Q1,South,200,250,50\n2013Q2,North,110,150,40\n2013Q2,South,220,250,30\n2013Q3,North,90,180,90\n2013Q3,South,115,180,65\n2013Q4,North,105,190,85\n2013Q4,South,90,180,90';
        *       var csv = new Contour.connectors.Csv(csvData);
        *
        *       new Contour({
        *           el: '.myChart',
        *           xAxis: { title: 'Quarter' },
        *           yAxis: { title: 'Profit ($)' }
        *       })
        *       .cartesian()
        *           // returns, in order of profitability, the top 3 most profitable quarters in the North region
        *       .column(csv.dimension('quarter').filter({region: 'North'}).top(3).measure('profit'))
        *       .render();
        *
        * @function top
        * @param {integer} t The number of results to return.
        * @return {array} The sorted data set, truncated after `t` results.
        */
        top: function (t) {
            this._take = t;
            return this;
        },

        /**
        * Returns only the bottom `t` results from the sorted data set. Call this after you have specified dimensions and/or filters but before you have called `.measure()`.
        *
        * ### Example:
        *
        *       var csvData = 'quarter,region,cost,revenue,profit\n2013Q1,North,100,150,50\n2013Q1,South,200,250,50\n2013Q2,North,110,150,40\n2013Q2,South,220,250,30\n2013Q3,North,90,180,90\n2013Q3,South,115,180,65\n2013Q4,North,105,190,85\n2013Q4,South,90,180,90';
        *       var csv = new Contour.connectors.Csv(csvData);
        *
        *       new Contour({
        *           el: '.myChart',
        *           xAxis: { title: 'Quarter' },
        *           yAxis: { title: 'Profit ($)' }
        *       })
        *       .cartesian()
        *           // returns, in order of profitability, the bottom 3 most profitable quarters in the North region
        *       .column(csv.dimension('quarter').filter({region: 'North'}).top(3).measure('profit'))
        *       .render();
        *
        * @function bottom
        * @param {integer} t The number of results to return.
        * @return {array} The sorted data set, including only the last `t` results.
        */
        bottom: function (t) {
            this._take = -t;
            return this;
        },

        data: function (measures, extras) {
            measures = _.isArray(measures) ? measures : [measures];
            var _this = this;
            var filteredData = this._filterSelector ? _.filter(_this._data, function(row, index) { return _this._filterSelector.call(_this, row, index, _this._headers); }) : this._data;
            var rolledRight = this._newMeasure ? _.map(filteredData, function (row, index) { var r = row.slice(); r.push(_this._newMeasure.fn.call(_this, row, index, _this._headers)); return r; } ) : filteredData;
            var rolledUp = this._rollup(rolledRight, this._dimension);
            var sortMeasureIndex = this._getMeasureIndex(measures[0]);

            if (this._take) {
                rolledUp.sort(function (a, b) { return +b[sortMeasureIndex] - +a[sortMeasureIndex]; });
                rolledUp = this._take > 0 ? rolledUp.slice(0, this._take) : rolledUp.slice(this._take);
            }

            var result = _.map(measures, function (m) { return _this._generateSeries.call(_this, m, rolledUp, extras); });

            return result;
        },

        _getMeasureIndex: function (measure) {
            return this._newMeasure && this._newMeasure.name === measure ? this._newMeasure.index : this._headers.indexOf(measure);
        },

        _getDimensionIndex: function (dimension) {
            return this._headers.indexOf(dimension);
        },

        _generateSeries: function (measure, data, extras) {
            var _this = this;
            var dimensionData = function (d, i) { return (typeof _this._dimension === 'function') ? _this._dimension.call(_this, d, i) : d[_this._dimension]; };
            var measureIndex = this._getMeasureIndex(measure);
            var result = _.map(data, function (d, i) {
                var xVal = dimensionData(d, i);
                var tryDate = Date.parse(xVal);
                var xData = xVal == +xVal ? +xVal : !_.isNaN(tryDate) ? new Date(tryDate) : xVal;
                var dataPoint = {
                    x: xData,
                    y: _.isNaN(+d[measureIndex]) ? d[measureIndex] : +d[measureIndex]
                };

                if (extras) {
                    var indices = _.map(extras, function (f) { return _this._getMeasureIndex(f); });
                    var extrasObj = {};
                    _.each(indices, function (i,index) {
                        extrasObj[extras[index]] = d[i];
                    });
                    _.extend(dataPoint, extrasObj);
                }

                return dataPoint;
            });

            return { name: measure, data: result };
        }
    });

})();

(function () {
    'use strict';

    // Return array of string values, or NULL if CSV string not well formed.
    function CSVtoArray(text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a = [];                     // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
            function(m0, m1, m2, m3) {
                // Remove backslash from \' in single quoted values.
                if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                // Remove backslash from \" in double quoted values.
                else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return ''; // Return empty string.
            });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        return a;
    };

    /**
    * Comma Separated Values Files connector (csv)
    *
    * ### Example:
    *
    *       var csvData = 'quarter,cost,revenue,profit\n2013Q1,100,150,50\n2013Q2,110,150,40\n2013Q3,90,180,90\n2013Q4,105,190,85';
    *       var csv = new Contour.connectors.Csv(csvData);
    *
    *       new Contour({
    *         el: '.myChart',
    *         xAxis: { title: 'Quarter' },
    *         yAxis: { title: 'Profit ($)' }
    *       })
    *       .cartesian()
    *       .column(csv.measure('profit'))
    *       .render();
    *
    * @class Contour.connectors.Csv
    */
    Contour.connectors.Csv = Contour.connectors.ConnectorBase.extend({
        constructor: function (raw, headerRow) {
            headerRow = typeof headerRow === 'undefined' ? true : headerRow;
            this.parse(raw, headerRow);

            this._dimension = 0;

            return this;
        },

        splitPattern: /,/,

        parse: function (raw, headerRow) {
            this._data = [];
            this._headers = [];
            if (!raw || !raw.length) return ;
            var rows = raw.split(/\r\n|\r|\n/);
            this._headers = headerRow ? _.map(rows.shift().split(this.splitPattern), function(d) { return d.toLowerCase().trim(); }) : _.range(0, rows[0].length);
            _.each(rows.filter(function (row) { return row.length; }), function (r) {
                this._data.push(r.split(this.splitPattern));
            }, this);
        }
    });

})();

(function () {
    'use strict';

    /**
    * JSON connector
    *
    * JSON data is assumed to have the following format:
    *   `{ "field1": ["a", "b", "c"], "field2": [1,2,3] }`
    *
    * ### Example:
    *
    *       var json = '{...}';
    *       var ds = new Contour.connectors.Json(json);
    *
    *       new Contour({
    *         el: '.myChart',
    *         xAxis: { title: 'Quarter' },
    *         yAxis: { title: 'Profit ($)' }
    *       })
    *       .cartesian()
    *       .column(ds.measure('profit'))
    *       .render();
    *
    * @class Contour.connectors.Json
    */
    Contour.connectors.Json = Contour.connectors.ConnectorBase.extend({
        constructor: function (json) {
            this._dimension = 0;
            this.parse(json);
            return this;
        },

        parse: function (raw) {
            var keys = _.keys(raw);
            this._headers = _.map(keys, function (d) { return d.toLowerCase(); }) || [];
            this._data = [];

            for (var i=0; i<keys.length; i++) {
                var keyData = raw[keys[i]];

                for (var j=0; j<keyData.length; j++) {
                    var row = this._data[j] || (this._data[j] = []);
                    row.push(keyData[j]);
                }
            }
        }
    });

})();

(function () {
    'use strict';

    /**
    * Tab Separated Values Files connector (tsv)
	*
	* ### Example:
    *
    *       var tsvData = 'quarter\tcost\trevenue\tprofit\n2013Q1\t100\t150\t50\n2013Q2\t110\t150\t40\n2013Q3\t90\t180\t90\n2013Q4\t105\t190\t85';
    *       var tsv = new Contour.connectors.Tsv(tsvData);
    *
    *       new Contour({
    *         el: '.myChart',
	*        xAxis: { title: 'Quarter' },
	*        yAxis: { title: 'Profit ($)' }
    *       })
    *       .cartesian()
    *       .column(tsv.measure('profit'))
    *       .render();
	*
    * @class Contour.connectors.Tsv
    */
    Contour.connectors.Tsv = Contour.connectors.Csv.extend({
        splitPattern: /\t/
    });

})();

Contour.connectors.version = '1.0.1';