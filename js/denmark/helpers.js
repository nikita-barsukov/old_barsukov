define(["d3","jquery", "colorbrewer"], function(){
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
    },
    generate_tooltip_html: function(data_point, format_func) {
      var tooltip_content = $("<table></table>");
      for (var key in data_point) {
        if (data_point.hasOwnProperty(key)) {
          var row = $("<tr></tr>")
          row.append("<td>" + key.charAt(0).toUpperCase() + key.slice(1) + ":</td>");
          var value = parseInt(data_point[key]);
          if (isNaN(value)) {
            value = data_point[key];
          }
          else {
            value = format_func(data_point[key]);            
          }
          row.append("<td>" + value + "</td>");
          tooltip_content.append(row)
        }
      }
      return tooltip_content;
    }
  }
    
})