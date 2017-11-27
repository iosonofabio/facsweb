/* Landing page d3.js */
class FACSPlot {
  constructor(svgId) {
      this.svgId = svgId;
      this.svg = d3.select('#'+this.svgId);
      this.divWidth = $('#'+this.svgId).parent().width();
      this.svgHeight = 400;
      this.svgWidth = 400;
      this.margin = {top: 5, bottom: 5, left: 5, right: 5};

      return this;
  }

  getTestData() {
    return [{'x': 100, 'y': 100}];
  }

  initialDraw () {
    var svg = this.svg,
        margin = this.margin,
        width = this.svgWidth - margin.left - margin.right,
        height = this.svgHeight - margin.top - margin.bottom;
    svg.selectAll("*").remove();
    console.log("test method");

    var data = this.getTestData();
    console.log(data);

    //responsive SVG needs these 2 attributes and no width and height attr
    svg.attr("preserveAspectRatio", "xMinYMin meet")
       .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom));

    var vis = svg.append("g")
                 .attr("transform", ("translate(" +
                                     margin.left + "," +
                                     margin.top + ")")
                      );

    // Test dot in the treeCenter
    vis.append("circle")
        .attr("cx", margin.left)
        .attr("cy", margin.top)
        .attr("r", 10)
        .style("fill", "red");

    return this;
  }
}

facsPlot = new FACSPlot("mainSvg").initialDraw();
