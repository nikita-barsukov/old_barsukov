define(["d3", "jquery", "backbone"], function(){
    var SparkLineChart = Backbone.View.extend({
        defaults: {
            width: 200,
            height: 100,
            buckets: 8,
            y_domain: [150000,550000],
            x_domain: [2000, 2012]
        },

        initialize: function(options) {
            this.options = _.extend({}, this.defaults, options);
        },

        // Dataset is array of JS objects
        // fields x and y must be present in objects
        render: function(dataset) {
            var chart = this;

            var x_scale = d3.scale.linear()
                .range([0,chart.options.width])
                .domain(chart.options.x_domain);

            var y_scale = d3.scale.linear()
                .range([chart.options.height, 0])
                .domain(chart.options.y_domain);

            var line_func = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x_scale(d["x"])})
                .y(function(d) { return y_scale(d["y"])});

            var base_line_func = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x_scale(d["x"])})
                .y(function(d) { return y_scale(d["base"])})

            this.svg = d3.select(this.el).append("svg")
              .attr("width", this.options['width'])
              .attr("height", this.options['height']);

            this.svg
                .append("path")
                .attr("class", "line")
                .attr("d", function(d) {return line_func(dataset); });

            this.svg
                .append("path")
                .attr("class", "line base-line")
                .attr("d", function(d) {return base_line_func(dataset); });
        }      
    });

    return SparkLineChart;
})