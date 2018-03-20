import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import * as d3 from "d3";
import * as Util from '../util/Util';


const margin = {top: 20, right: 0, bottom: 20, left: 50}
class Axis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const node = ReactDOM.findDOMNode(this.refs.axisContainer);
    // console.log(node)
    if(this.props.orient === "bottom"){
      const axis = d3.axisBottom()
        .ticks(5)
        .scale(this.props.scale);

      d3.select(node).call(axis);
    }
    else{
      const axis = d3.axisLeft()
        .ticks(5)
        .scale(this.props.scale);

      d3.select(node).call(axis);
    }
  }

  render() {
    return <g className="axis" ref="axisContainer" transform={this.props.translate} />
  }
}

class XYAxis extends Component {
  render() {
    const { width_m, height_m } = this.props.svgDimensions;
    // console.log(this.props.height)
    return (
      <g className="xy-axis">
        <Axis
          translate={"translate(0," + height_m + ")"}
          scale={this.props.xScale}
          orient="bottom"
        />
        <Axis
          translate={"translate(" + margin.left + ",0)"}
          scale={this.props.yScale}
          orient="left"
        />
      </g>
    );
  }
}

class LineChart extends Component {
   constructor(props){
      super(props)
      this.state = {
          data : this.props.data,
          highlightedPoint : this.props.highlightedPoint
      };
   }

   componentDidMount() {
     let svg = d3.select(ReactDOM.findDOMNode(this.refs.svg))
     const width = this.props.width - margin.left - margin.right,
         height = this.props.height - margin.top - margin.bottom;

     svg.append("text")
       .attr("x", (width+margin.left)/2)
       .attr("y", height+margin.bottom)
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text("Distance (ft)")
       .attr("class", "x axis label");

     svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", 0-(height/2))
       .attr("y", 0)
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text(()=>{
         switch(this.props.id){
           case 'fg_line_FG':
             return 'Field Goal (%)';
             break;
           case 'fg_line_Freq':
             return 'Frequency (%)'
             break;
         }
       })
       .attr("class", "y axis label");

     // use d3's events so we get to use the handy d3.mouse function to get x,y in svg coords
     const handleMouseMove = this._handleMouseMove.bind(this)
     d3.select(ReactDOM.findDOMNode(this.refs.svg)).on('mousemove', function mouseMoveHandler() {
       handleMouseMove(d3.mouse(this));
     }).on('mouseleave', function mouseOutHandler() {
       handleMouseMove([null, null]);
     });
   }

   componentWillUnmount() {
     // unbind d3 mouse listeners
     d3.select(ReactDOM.findDOMNode(this.refs.svg)).on('mousemove', null).on('mouseleave', null);
   }

  _handleMouseMove([mouseX, mouseY]) {
    // find nearest data point
    const { data, xKey, setHighlightedPoint } = this.props;
    const { xScale, yScale } = this._chartComponents();
    // convert the mouse x and y to the domain x and y using our chart scale
    let domainX = xScale.invert(mouseX);
    let domainY = yScale.invert(mouseY);

    // if the mouse is outside the domain, consider it having exited
    if (domainX < xScale.domain()[0] || domainX > xScale.domain()[1]) {
     domainX = null;
    }
    if (domainY < yScale.domain()[0] || domainY > yScale.domain()[1]) {
     domainY = null;
    }

    // send an action indicating which point to highlight if we are near one, otherwise indicate
    // no point should be highlighted.
    if (domainX !== null && domainY !== null && mouseX != null && mouseY != null) {
     // find the nearest point to the x value
     const point = Util.findClosest(data, domainX, (d) => d[xKey]);
     setHighlightedPoint(point)
    }
    // else {
    //   setHighlightedPoint();
    // }
  }

  _chartComponents(){
      const { id, setHighlightedPoint, highlightedPoint, xKey, yKey } = this.props;
      const data = this.state.data;

      const width_m = this.props.width - margin.left - margin.right,
          height_m = this.props.height - margin.top - margin.bottom;

      const xScale = d3.scaleLinear().domain(d3.extent(data, (d) => d[xKey])).range([margin.left, width_m]),
            yScale = d3.scaleLinear().domain([0,100]).range([height_m, margin.top]);
      //       z = d3.scaleOrdinal(d3.schemeCategory10);
      const valueLine = d3.line()
        .x(function(d) { return xScale(d[xKey]);})
        .y(function(d) { return yScale(d[yKey]*100); })


      return {
        xScale,
        yScale,
        valueLine,
        width_m,
        height_m
      };
  }

  render(){
      const { id, data, width, height, highlightedPoint, xKey, yKey } = this.props;
      const { xScale, yScale, valueLine, width_m, height_m } = this._chartComponents();

      const svgDimensions ={
        width_m,
        height_m
      }

      let highlightMark, text;
      if (highlightedPoint.length !== 0) {
        highlightMark = <circle cx={xScale(highlightedPoint[xKey])} cy={yScale(highlightedPoint[yKey]*100)} r={3} className='highlight-mark' />;
        const factor = Math.pow(10, 2);
        const number = highlightedPoint[yKey]*100;
        let p = highlightedPoint[xKey] + "ft " +Math.round(number * factor) / factor+"%";
        text = <text x={xScale(5)} y={yScale(100)}> {p} </text>
      }
      return(
          <div className={id}>
            <svg ref='svg' width={width} height={height} className='chart line-chart' translate={"translate(" + 20 + "," + 20 + ")"}>
              <path d={valueLine(data)} className='series' />
              {highlightMark}
              {text}
              <XYAxis xScale={xScale} yScale={yScale} svgDimensions={svgDimensions} {...this.props} />
            </svg>
          </div>
      );
  }
}

export default LineChart
