import React, { Component } from 'react';
import * as d3 from "d3";

class LineChart extends Component {
   constructor(props){
      super(props)
      this.state = {
          data : this.props.data
      };
      this.createLineChart = this.createLineChart.bind(this)
   }

  componentDidMount(){
    this.createLineChart()
  }

  createLineChart(){
      // const node = this.node;
      const data = this.state.data;
      const id = this.props.id,
          xKey = this.props.xKey,
          yKey = this.props.yKey;
      const svg = d3.select("."+this.props.id).append("svg"),
          margin = {top: 20, right: 0, bottom: 20, left: 50};
          // width = this.props.width - margin.left - margin.right,
          // height = this.props.height - margin.top - margin.bottom;

      svg.attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 300 180")
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")

      // console.log(parseInt(d3.select("."+this.props.id).select('svg').style('width')))
      // console.log(parseInt(d3.select("."+this.props.id).select('svg').style('height')))
      const width = parseInt(d3.select("."+this.props.id).select('svg').style('width')) - margin.left - margin.right,
        height = parseInt(d3.select("."+this.props.id).select('svg').style('height')) - margin.top - margin.bottom;

      // console.log(height)
      const xScale = d3.scaleLinear().range([margin.left, width]),
            yScale = d3.scaleLinear().range([height, margin.top]);
      //       z = d3.scaleOrdinal(d3.schemeCategory10);
      const valueLine = d3.line();

      xScale.domain(d3.extent(data, function(d) { return d[xKey]; }))
      yScale.domain([0, d3.max(data, function(d) { return d[yKey]*100; })])
      valueLine
        .x(function(d) { return xScale(d[xKey]);})
        .y(function(d) { return yScale(d[yKey]*100); })

      // const color = d3.scaleLinear()
      //     .domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])
      //     .range(["#FFFFFF","#4CAF50", "#F44336", "#2196F3", "#AED581", "#E0E0E0", "#B39DDB", "#FFEB3B", "#A1887F", "#F48FB1", "#F57C00", "#FF5722", "#9E9E9E", "#7E57C2", "#81D4FA", "#FF8A80", "#424242", "#F5F5F5", "#00BCD4"]);

      const xAxis = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(5));

      const yAxis = svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(yScale));

      svg.append("text")
        .attr("x", (width+margin.left)/2)
        .attr("y", height+margin.bottom)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Distance (ft)")
        .attr("class", "x axis label");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(()=>{
          switch(this.props.id){
            case 'fg_line':
              return 'Field Goal (%)';
              break;
            case 'freq_line':
              return 'Frequency (%)'
              break;
          }
        })
        .attr("class", "y axis label");

      svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueLine)
        .attr("fill",  "none")
        .attr("stroke", "red")

      const focus = svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

      focus.append('circle')
        .attr('r', 4.5);

      focus.append('line')
        .classed('x', true);

      focus.append('line')
        .classed('y', true);

      focus.append('text')
        .attr('x', 9)
        .attr('dy', '.35em');

      svg.append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", width)
        .attr("height", height)
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);


      d3.selectAll('.focus')
        .style('opacity', 0.7);
      //
      d3.selectAll('.focus circle')
        .style("fill", "none")
        .style( "stroke", "black");

      d3.selectAll('.focus line')
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', '1.5px')
        .style('strokeDasharray', '3 3');

      function mousemove() {
        const x0 = xScale.invert(d3.mouse(this)[0]),
            bisectDate = d3.bisector(d => {
              return d.distance
            }).left,
            index = bisectDate(data, x0, 1),
            d0 = data[index - 1],
            d1 = data[index],
            d = x0 - d0.distance > d1.distance - x0 ? d1 : d0,
            y = [];
        focus.attr('transform', `translate(${xScale(d[xKey])}, ${yScale(d[yKey]*100)})`);
        focus.selectAll('line.x')
          .attr('x1', 0)
          .attr('x2', -xScale(d[xKey])+margin.left)
          .attr('y1', 0)
          .attr('y2', 0);
        focus.selectAll('line.y')
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', 0)
          .attr('y2', height - yScale(d[yKey]*100));
        focus.select("text").text(function() {
          const factor = Math.pow(10, 2);
          const number = d[yKey]*100;
          return Math.round(number * factor) / factor+"%";
        });
      }
  }

  render(){
      const { id } = this.props;
      return(
          <div className={id}>
          </div>
      );
  }
}
export default LineChart
