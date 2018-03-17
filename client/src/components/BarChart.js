import React, { Component } from 'react';
import * as d3 from "d3";

class BarChart extends Component {
   constructor(props){
      super(props)
      this.state = {
          data : this.props.data
      };
      this.createBarChart = this.createBarChart.bind(this)
   }

  componentDidMount(){
    this.createBarChart()
  }

  createBarChart(){
      // const node = this.node;
      const data = this.state.data;
      console.log(data)
      const id = this.props.id;
      //     xKey = this.props.xKey,
      //     yKey = this.props.yKey;
      const svg = d3.select("."+this.props.id).append("svg"),
          margin = {top: 20, right: 0, bottom: 20, left: 50};
          // width = this.props.width - margin.left - margin.right,
          // height = this.props.height - margin.top - margin.bottom;

      svg.attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 300 300")
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")

      console.log(parseInt(d3.select("."+this.props.id).select('svg').style('width')))
      console.log(parseInt(d3.select("."+this.props.id).select('svg').style('height')))
      const width = (parseInt(d3.select("."+this.props.id).select('svg').style('width')) - margin.left - margin.right)/2,
        height = parseInt(d3.select("."+this.props.id).select('svg').style('height')) - margin.top - margin.bottom;

      console.log(height);
      const names = [],
        leftData = [],
        rightData = [];
      data.map(d => {
        names.push(d.distance);
        switch(id){
          case 'fg_bar':
            leftData.push(d.left_fg*100);
            rightData.push(d.right_fg*100);
            break;
          case 'freq_bar':
            leftData.push(d.left);
            rightData.push(d.right);
            break;
        }
      })

      // names.reverse()
      // leftData.reverse()
      // rightData.reverse()
      const labelArea = 160;
      let chart,
          bar_height = height/(names.length);
          // height = bar_height * (names.length);

      chart = svg.attr('class', 'chart')
        .attr('width', labelArea + width + width)
        .attr('height', height);

      const xScaleLeft = d3.scaleLinear()
        .domain([0, d3.max([...leftData,...rightData])])
        .range([0, width]);

      const xAxisScaleLeft = d3.scaleLinear()
        .domain([d3.max([...leftData,...rightData]), 0])
        .range([0, width]);

      const yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(names)])
        .range([10, height]);

      // const yScale = d3.scaleBand()
      //   .domain(names)
      //   .rangeRound([10, height]);

      const yPosByIndex = function(d, index){ return yAxisScale(index); }

      const xAxisLeft = svg.append("g")
        .attr("class", "x axis left")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(d3.axisBottom(xAxisScaleLeft).ticks(3));

      const yAxis = svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(yAxisScale).ticks(6));

      chart.selectAll("rect.left")
        .data(leftData)
        .enter().append("rect")
        .attr("x", function(pos) { return width - xScaleLeft(pos) + margin.left; })
        .attr("y", yPosByIndex)
        .attr("class", "left")
        .attr("width", xScaleLeft)
        .attr("height", bar_height)
        .attr("fill", "#90CAF9")
        .attr("fill-opacity", 0.5)

      const xScaleRight = d3.scaleLinear()
         .domain([0, d3.max([...leftData,...rightData])])
         .range([0, width]);

      const xAxisRight = svg.append("g")
        .attr("class", "x axis right")
        .attr("transform", "translate(" + (width+margin.left) + "," + height + ")")
        .call(d3.axisBottom(xScaleRight).ticks(3));

      chart.selectAll("rect.right")
        .data(rightData)
        .enter().append("rect")
        .attr("x", width + margin.left)
        .attr("y", yPosByIndex)
        .attr("class", "right")
        .attr("width", xScaleRight)
        .attr("height", bar_height)
        .attr("fill", "#E57373")
        .attr("fill-opacity", 0.5);

      svg.append("text")
        .attr("x", (width+margin.left))
        .attr("y", height+margin.bottom)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(()=>{
          switch(this.props.id){
            case 'fg_bar':
              return 'Field Goal (%)';
              break;
            case 'freq_bar':
              return '# of Shots'
              break;
          }
        })
        .attr("class", "x axis label");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Distance (ft)")
        .attr("class", "y axis label");

      const midLine = svg.append("g")
        .append("line")
        .attr("x1", width+margin.left)
        .attr("y1", margin.top/2)
        .attr("x2", width+margin.left)
        .attr("y2", height)
        .attr("stroke-width", 0.1)
        .attr("stroke", "black");

      const focus = svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

      // focus.append('circle')
      //   .attr('r', 4.5);

      focus.append('line')
        .classed('x', true);

      focus.append('line')
        .classed('y', true);

      focus.append('text')
        .attr('class', 'leftText')
        .attr('x', 9)
        .attr('dy', '.35em');

      focus.append('text')
        .attr('class', 'rightText')
        .attr('x', 9)
        .attr('dy', '.35em');

      svg.append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", width*2+margin.left)
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
        // console.log(d3.mouse(this))
        const y0 = yAxisScale.invert(d3.mouse(this)[1]),
            bisectDate = d3.bisector(d => {
              return d.distance
            }).left,
            index = bisectDate(data, y0, 1),
            d0 = data[index - 1],
            d1 = data[index],
            d = y0 - d0.distance > d1.distance - y0 ? d1 : d0,
            y = [];

        focus.attr('transform', `translate(0, ${yAxisScale(d.distance)})`);
        focus.selectAll('line.x')
          .attr('x1', margin.left)
          .attr('x2', 2*width+margin.left)
          .attr('y1', 0)
          .attr('y2', 0);

        focus.select(".leftText")
          .text(function() {
            const factor = Math.pow(10, 2);
            const leftShot = d.left;
            const lfg = d.left_fg*100

            switch(id){
              case 'fg_bar':
                return "Left: " + Math.round(lfg * factor) / factor + "%";
                break;
              case 'freq_bar':
                return "Left: " + leftShot;
                break;
            }

          })
          .attr("x", 60)
          .attr("y", function() {
            if(d.distance<25) return 10
            else return -10
          });

        focus.select(".rightText")
          .text(function() {
            const factor = Math.pow(10, 2);
            const rightShot = d.right;
            const rfg = d.right_fg*100

            switch(id){
              case 'fg_bar':
                return "Right: " + Math.round(rfg * factor) / factor + "%";
                break;
              case 'freq_bar':
                return "Right: " + rightShot;
                break;
            }

          })
          .attr("x", 260)
          .attr("y", function() {
            if(d.distance<25) return 10
            else return -10
          });

        console.log(svg.select("rect.right"))
        svg.select("rect.right")
          .attr("fill-opacity", 1);
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
export default BarChart
