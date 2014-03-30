define(["helpers","backbone", "d3", "topojson"], function(helpers){
    // requires to set an element on initializing
    var BaseChart = Backbone.View.extend({
        defaults: {
            width: 960,
            height: 650,
            buckets: 8,
            domain: [150000,550000],
            legend_format: d3.format(",", Math.ceil),
            enhance: true
        },
        initialize: function(options) {
            this.options = _.extend({}, this.defaults, options);
        },

        render: function(){
            this.svg = d3.select(this.el).append("svg")
              .attr("width", this.options['width'])
              .attr("height", this.options['height'])
              
            this.chart = this.svg.append("g")
              .attr("class", "chart-container");

            chart = this.chart;

            if(this.options.enhance) {
                var zoom = d3.behavior.zoom()
                    .scaleExtent([1, 5])
                    .on("zoom", function() {
                          chart.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                        });
                this.svg.call(zoom)

            }
            return this;
        },

        render_map: function(m) {
            var chart = this;
                
            var projection = d3.geo.albers()
                  .center([16, 56.2])
                  .rotate([4.4, 0])
                  .parallels([54, 57])
                  .scale(11000)
                  .translate([chart.options['width'] / 2, chart.options['height'] / 2]);

            var path = d3.geo.path()
                .projection(projection);

            chart.chart.selectAll(".kommune")
                .data(topojson.feature(m, m["objects"]['kommuner2M']).features)
                .enter().append("path")
                  .attr("d", path)
                  .attr("class", function(d){
                    return d["properties"]["KOMNAVN"]
                  })
        },
        // dataset: array of datapoints
        render_cholopleth: function(dataset) {
            var chart = this;
            var sc = helpers.color_scale_function(chart.options.domain, chart.options.palette, chart.options.buckets);

            dataset.forEach(function(d){
                col = sc(d["income"]);
                chart.chart.selectAll("." + d["kommune"]).transition().duration(750).attr("fill", col);
            })
        },  
        render_legend: function(){
            var chart = this;

            var legend_breaks = helpers.color_scale_function(chart.options.domain, 
                chart.options.palette, 
                chart.options.buckets).quantiles(); 

            this.legend = chart.svg.append("g")
                .attr("class", "legend");
            this.legend.selectAll("rect")
                .data(d3.range(this.options.buckets))
                .enter().append("rect")
                    .attr("width", 40)
                    .attr("height", 20)
                    .attr("y", function(d, i){ return 45 + i*23;})
                    .attr("x", 10)
                    .attr("fill", function(d,i){return colorbrewer[chart.options.palette][chart.options.buckets][i]})
                    .attr("class", "legend-block");

            this.legend.selectAll("text")
                .data(legend_breaks)
            .enter().append("text")
                .attr("text-anchor", "start") // text-align
                .attr("x", 50)
                .attr("y", function(d, i){return 57 + i*23})
                .attr("dx", 8) // padding-right
                .attr("dy", 15) // vertical-align: used font size (copied from css. must be a better way)
                .attr("class", "legend")
                .text(function (d){return chart.options.legend_format(d)} );

        }
    });
    return BaseChart;  
})