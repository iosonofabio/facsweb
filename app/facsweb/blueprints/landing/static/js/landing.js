/* Landing page d3.js */
class FACSPlot {
  constructor(svgId) {
      this.svgId = svgId;
      this.divWidth = $('#'+this.svgId).parent().width();
      this.svgHeight = 500;
      this.svgWidth = this.divWidth;

      var svg = d3.select('#'+this.svgId),
          margin = {top: 55, bottom: 55, left: 65, right: 25},
          width = this.svgWidth - margin.left - margin.right,
          height = this.svgHeight - margin.top - margin.bottom,
          vpad = 80,
          widthPlot = (width - vpad) / 2,
          xPlots = [margin.left, margin.left + widthPlot + vpad];

      //responsive SVG needs these 2 attributes and no width and height attr
      svg.attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom));

      var vis = svg.append("g")
                   .attr("transform", ("translate("+margin.left+","+margin.top+")"));

      this.svg = svg;
      this.margin = margin;
      this.vis = vis;
      this.width = width;
      this.height = height;
      this.vpad = vpad;
      this.widthPlot = widthPlot;
      this.xPlots = xPlots;

      this.getTissuesCellTypes((function(error, data) {
        if (error) {
          console.log("Error loading tissues and cell types:")
          console.log(error);
          return;
        }

        var selectTissue = d3.select("#inputTissue"),
            selectCellType = d3.select('#inputCellType');

        selectTissue.selectAll("option")
          .data(data.tissues)
          .enter()
          .append("option")
          .attr('value',function (d) { return d })
          .text(function (d) { return d.charAt(0).toUpperCase() + d.slice(1) });

        var tissue = selectTissue.property("value");

        selectCellType.selectAll("option")
          .data(data.cell_types[tissue])
          .enter()
          .append("option")
          .attr('value',function (d) { return d })
          .text(function (d) { return (d.charAt(0).toUpperCase() + d.slice(1)).split('_').join(' ') });

        var cellType = selectCellType.property("value");
      
        this.erase();
        this.drawData(tissue, cellType);

        selectCellType.on('change', (function () {
          var tissue = d3.select("#inputTissue").property("value"),
              cellType = d3.select('#inputCellType').property("value");
          this.erase();
          this.drawData(tissue, cellType);
        }).bind(this));

      }).bind(this));
      return this;
  }

  getTestData() {
    return [{'x': 100, 'y': 100}];
  }

  drawData(tissue, cellType) {
      this.getData(tissue, cellType, this._drawData.bind(this));
  }

  getTissuesCellTypes(callback) {
      var url = "/api/data/tissues_cell_types";
      d3.json(url, callback);
  }

  getData(tissue, cellType, callback) {  
      var url = "/api/data/merged_predictor/"+tissue+"/"+cellType;
      d3.json(url, callback);
  }

  _drawData(error, data) {
    if (error) {
      console.log("Error loading plot data:")
      console.log(error);
      return;
    }

    var vis = this.vis,
        margin = this.margin,
        vpad = this.vpad,
        height = this.height,
        width = this.width,
        widthPlot = this.widthPlot,
        xPlots = this.xPlots;
    
    var charts = {},
        antiXOffset = 0;

    if ('scattering' in data.data) {
      antiXOffset += widthPlot + vpad;

      var xlimScatter = data.data.xlim_scattering,
          ylimScatter = data.data.ylim_scattering;

      charts.sca = vis.append("g")
            .attr("id", "scatteringPlot");

      var xSca = d3.scaleLinear()
          .domain(xlimScatter)
          .range([0, widthPlot]),
          ySca = d3.scaleLinear()
          .domain(ylimScatter)
          .range([height, 0]);

      var xScaAxis = d3.axisBottom().scale(xSca),
          yScaAxis = d3.axisLeft().scale(ySca);

      charts.sca.append("text")
          .attr("x", widthPlot / 2)
          .attr("dy", "-1ex")
          .attr("fill", "#000")
          .style("text-anchor", "middle")
          .text("Scattering");

      charts.sca.append("g")
          .attr("class", "d3-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xScaAxis)
          .append("text")
          .attr("x", widthPlot / 2)
          .attr("y", 50)
          .attr("fill", "#000")
          .style("text-anchor", "middle")
          .text(data.data.scattering_axis_labels[0]);
          
      charts.sca.append("g")
          .attr("class", "d3-axis")
          .call(yScaAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("fill", "#000")
          .attr("dy", "-3.5em")
          .attr("x", -height / 2)
          .style("text-anchor", "middle")
          .text(data.data.scattering_axis_labels[1]);

      charts.sca.append("g")
          .attr("class", "scatter point")
          .selectAll("scattering_point")
          .data(data.data.scattering)
          .enter()
          .append("circle")
          .attr("class", "circle scattering_point")
          .attr("fill", function(d, i) {
            if (data.data.identity[i])
              return "#ffb544";
            else
              return "steelblue";
          })
          .attr("cx", function(d) { return xSca(d[0]); })
          .attr("cy", function(d) { return ySca(d[1]); })
          .attr("r", 3);

      // Roots of predictors
      charts.sca.append("g")
          .attr("class", "scatter_model_root")
          .selectAll("scattering_root")
          .data(data.models.scattering.roots)
          .enter()
          .append("circle")
          .attr("class", "circle scattering_root")
          .attr("fill", "#222")
          .attr("cx", function(d) { return xSca(d[0]); })
          .attr("cy", function(d) { return ySca(d[1]); })
          .attr("r", 1);

      charts.sca.append("g")
          .attr("class", "scatter_model_root")
          .selectAll("scattering_root")
          .data(data.models.scattering.roots_pos)
          .enter()
          .append("circle")
          .attr("class", "circle scattering_root")
          .attr("fill", "#AAA")
          .attr("cx", function(d) { return xSca(d[0]); })
          .attr("cy", function(d) { return ySca(d[1]); })
          .attr("r", 1);
      charts.sca.append("g")
          .attr("class", "scatter_model_root")
          .selectAll("scattering_root")
          .data(data.models.scattering.roots_neg)
          .enter()
          .append("circle")
          .attr("class", "circle scattering_root")
          .attr("fill", "#AAA")
          .attr("cx", function(d) { return xSca(d[0]); })
          .attr("cy", function(d) { return ySca(d[1]); })
          .attr("r", 1);
    }

    // Antibody chart
    charts.anti = vis.append("g")
            .attr("id", "antibodyPlot")
            .attr("transform", "translate("+antiXOffset+", 0)");

    var xlimAnti = data.data.xlim_antibodies,
        ylimAnti = data.data.ylim_antibodies;

    // NOTE: no need to use margins here, everything will be an SVG group of vis
    var xAnti = d3.scaleLinear()
        .domain(xlimAnti)
        .range([0, widthPlot]),
        yAnti = d3.scaleLinear()
        .domain(ylimAnti)
        .range([height, 0]);

    var xAntiAxis = d3.axisBottom().scale(xAnti),
        yAntiAxis = d3.axisLeft().scale(yAnti);

    charts.anti.append("text")
        .attr("x", widthPlot / 2)
        .attr("dy", "-1ex")
        .attr("fill", "#000")
        .style("text-anchor", "middle")
        .text("Antibody stains");

    charts.anti.append("g")
        .attr("class", "d3-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAntiAxis)
        .append("text")
        .attr("x", widthPlot / 2)
        .attr("y", 50)
        .attr("fill", "#000")
        .style("text-anchor", "middle")
        .text(data.data.antibody_axis_labels[0]);
        
    charts.anti.append("g")
        .attr("class", "d3-axis")
        .call(yAntiAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .attr("dy", "-3.5em")
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .text(data.data.antibody_axis_labels[1]);

    // Data points
    charts.anti.append("g")
        .attr("class", "anti point")
        .selectAll("antibody_point")
        .data(data.data.antibodies)
        .enter()
        .append("circle")
        .attr("class", "circle antibody_point")
        .attr("fill", function(d, i) {
          if (data.data.identity[i])
            return "#ffb544";
          else
            return "steelblue";
        })
        .attr("cx", function(d) { return xAnti(d[0]); })
        .attr("cy", function(d) { return yAnti(d[1]); })
        .attr("r", 3);

      // Model roots
      charts.anti.append("g")
          .attr("class", "antibody_model_root")
          .selectAll("antibody_root")
          .data(data.models.antibodies.roots)
          .enter()
          .append("circle")
          .attr("class", "circle antibody_root")
          .attr("fill", "#222")
          .attr("cx", function(d) { return xAnti(d[0]); })
          .attr("cy", function(d) { return yAnti(d[1]); })
          .attr("r", 1);
    charts.anti.append("g")
        .attr("class", "antibody_model_root")
        .selectAll("antibody_root")
        .data(data.models.antibodies.roots_pos)
        .enter()
        .append("circle")
        .attr("class", "circle antibody_root")
        .attr("fill", "#AAA")
        .attr("cx", function(d) { return xAnti(d[0]); })
        .attr("cy", function(d) { return yAnti(d[1]); })
        .attr("r", 1);
    charts.anti.append("g")
        .attr("class", "antibody_model_root")
        .selectAll("antibody_root")
        .data(data.models.antibodies.roots_neg)
        .enter()
        .append("circle")
        .attr("class", "circle antibody_root")
        .attr("fill", "#AAA")
        .attr("cx", function(d) { return xAnti(d[0]); })
        .attr("cy", function(d) { return yAnti(d[1]); })
        .attr("r", 1);

  }

  erase () {
    var vis = this.vis;
    vis.selectAll("*").remove();
  
  }
}

facsPlot = new FACSPlot("mainSvg");
