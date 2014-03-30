define(["d3", "colorbrewer"], function(){
  return {
    // Outputs scale function: numeric domain to colors in 
    // More info: http://colorbrewer2.org/ and http://bl.ocks.org/mbostock/5577023
    // domain:Array. array of values, output range
    // color_palette: String, specifies color brewer color scheme. 
    // buckets: Number. number of distinct colors that scale funciton outputs 
    color_scale_function: function (domain, color_palette, buckets) {

      var colorScale = d3.scale.quantile()
          .domain(domain)
          .range(colorbrewer[color_palette][buckets]);
      return colorScale
    }
  }
    
})