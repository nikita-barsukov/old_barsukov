requirejs.config({
    paths: {
        jquery: '../../lib/jquery',
        backbone: '../../lib/backbone',
        d3: "../../lib/d3",
        queue: "http://d3js.org/queue.v1.min",
        topojson: "../../lib/topojson",
        underscore: "../../lib/underscore",
        colorbrewer: "../../lib/colorbrewer",
        jqueryui: "../../lib/jquery-ui-1.10.2"
    },
    shims: {
        "d3": {
            exports: "d3"
        },
        "topojson": {
            exports: "topojson"
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        "colorbrewer" :{
            exports: "colorbrewer"
        }
    }
});

require(["chart_base", "queue"], function(BaseChart, queue){
    queue()
        .defer(d3.json, "lib/dk.json")
        .defer(d3.csv, "raw_logs/disposable_household_income.csv")
        .await(ready);

    function ready(error, dk_map, income_data) {
        var f = function(a){
            console.log(a)
        }
        var db = _.map(income_data, function(e){
            return {kommune: e["muni"], income: e["y-2011"]}
        });
        var ch = new BaseChart({
            el: "#disposable-income",
            palette: "PuRd"
        });
        ch.render();
        ch.render_map(dk_map);

        ch.render_cholopleth(db);
        ch.render_legend()
        ch.render_slider()       
    }
})