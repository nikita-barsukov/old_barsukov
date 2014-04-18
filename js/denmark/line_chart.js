define(["d3", "jquery", "backbone"], function(){
    var SparkLineChart = Backbone.View.extend({
        defaults: {
            width: 200,
            height: 100,
            buckets: 8,
            y_domain: [150000,550000],
            x_domain: [2000, 2012],
            margin: {top: 5, right: 5, bottom: 10, left: 40}
        },

        initialize: function(options) {
            this.options = _.extend({}, this.defaults, options);
        },

        // Dataset is array of JS objects
        // fields x and y must be present in objects
        render: function(dataset, year) {
            var chart = this;

            this.x_scale = d3.scale.linear()
                .range([0,chart.options.width])
                .domain(chart.options.x_domain);

            this.y_scale = d3.scale.linear()
                .range([chart.options.height, 0])
                .domain(chart.options.y_domain);
            x_scale = this.x_scale;
            y_scale = this.y_scale;

            var line_func = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x_scale(d["x"])})
                .y(function(d) { return y_scale(d["y"])});

            var base_line_func = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x_scale(d["x"])})
                .y(function(d) { return y_scale(d["base"])});

            var yAxis = d3.svg.axis()
                  .scale(y_scale)
                  .orient("left")
                  .tickValues([200000, 300000, 400000, 500000]);;

            this.svg = d3.select(this.el).append("svg")
              .attr("width", this.options['width'] + this.options["margin"].right + this.options["margin"].left)
              .attr("height", this.options['height'] + this.options["margin"].top + this.options["margin"].bottom);

            this.svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .attr("transform", "translate(" + this.options.margin.left + "," + this.options.margin.top + ")")

            this.chart_container = this.svg.append("g")
                    .attr("transform", "translate(" + this.options.margin.left + "," + this.options.margin.top + ")");

            this.chart_container
                .append("path")
                .attr("class", "line")
                .attr("d", function(d) {return line_func(dataset); });

            // base line
            this.chart_container
                .append("path")
                .attr("class", "line base-line")
                .attr("d", function(d) {return base_line_func(dataset); });
        },

        render_year_line: function(year) {
            var chart = this;

            chart.chart_container.append("line")
                    .attr("x1", x_scale(year))
                    .attr("y1", 0)
                    .attr("x2", x_scale(year))
                    .attr("y2", chart.options.height)
                    .attr("class", "year-line");
            chart.chart_container.append("text")
                .text(year)
                .attr("x", x_scale(year) - 10)
                .attr("y", chart.options.height+ 5)
        }  
    });

    return SparkLineChart;
})