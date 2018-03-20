import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
    // console.log(this.props.height)
    const { width_m, height_m} = this.props.svgDimensions;
    return (
      <g className="xy-axis">
        <Axis
          translate={"translate(" + margin.left/2 + "," + height_m + ")"}
          scale={this.props.xScaleLeft}
          orient="bottom"
        />
        <Axis
          translate={"translate(" + (width_m + margin.left/2 ) + "," + height_m + ")"}
          scale={this.props.xScaleRight}
          orient="bottom"
        />
        <Axis
          translate={"translate(" + margin.left/2 + ",0)"}
          scale={this.props.yScale}
          orient="left"
        />
      </g>
    );
  }
}
class Bars extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { scales, data, svgDimensions, rl } = this.props;
    const { xScaleLeft, xAxisScaleLeft, yAxisScale, xScaleRight } = scales;
    const { width_m, height_m, bar_height } = svgDimensions;
    let bars;
    if(rl === "left"){
       bars = (
        data.map((datum,index) =>
          <rect
            key={index}
            x={width_m - xScaleLeft(datum) + margin.left/2}
            y={yAxisScale(index)}
            height={bar_height}
            width={xScaleLeft(datum)}
            fill={"#90CAF9"}
            fillOpacity={0.7}
          />,
        )
      )
    }
    else{
       bars = (
        data.map((datum,index) =>
          <rect
            key={index}
            x={width_m + margin.left/2}
            y={yAxisScale(index)}
            height={bar_height}
            width={xScaleRight(datum)}
            fill={"#E57373"}
            fillOpacity={0.7}
          />,
        )
      )
    }

    return (
      <g>{bars}</g>
    )
  }
}
class BarChart extends Component {
   constructor(props){
      super(props)
      this.state = {
          data : this.props.data,
          highlightedPoint : this.props.highlightedPoint
      };
   }

  componentDidMount(){
    const { id } = this.props
    let svg = d3.select(ReactDOM.findDOMNode(this.refs.svg))
    const width = (this.props.width - margin.left - margin.right)/2,
        height = this.props.height - margin.top - margin.bottom;
    svg.append("text")
      .attr("x", (width+margin.left/2))
      .attr("y", height+margin.bottom)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(()=>{
        switch(id){
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
      .attr("y", -margin.left/2 )
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Distance (ft)")
      .attr("class", "y axis label");


    const handleMouseMove = this._handleMouseMove.bind(this)
    d3.select(ReactDOM.findDOMNode(this.refs.svg)).on('mousemove', function mouseMoveHandler() {
      handleMouseMove(d3.mouse(this));
    }).on('mouseleave', function mouseOutHandler() {
      handleMouseMove([null, null]);
    });
  }

  _handleMouseMove([mouseX, mouseY]) {
    // find nearest data point
    const { data, xKey, setHighlightedPoint } = this.props;
    const { xScaleLeft, yAxisScale } = this._chartComponents();
    // convert the mouse x and y to the domain x and y using our chart scale
    let domainX = xScaleLeft.invert(mouseX);
    let domainY = yAxisScale.invert(mouseY);

    // if the mouse is outside the domain, consider it having exited
    if (domainX < xScaleLeft.domain()[0] || domainX > xScaleLeft.domain()[1]) {
     domainX = null;
    }
    if (domainY < yAxisScale.domain()[0] || domainY > yAxisScale.domain()[1]) {
     domainY = null;
    }

    // send an action indicating which point to highlight if we are near one, otherwise indicate
    // no point should be highlighted.
    if (domainX !== null && domainY !== null && mouseX != null && mouseY != null) {
     // find the nearest point to the x value
     const point = Util.findClosest(data, domainX, (d) => d[xKey]);
     // console.log(point)
     let h_point = data.filter(d => d.distance === point.distance)
     setHighlightedPoint(point)
    }
    // else {
    //   setHighlightedPoint();
    // }
  }

  _chartComponents(){
      const { id, data } = this.props;

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

      const width_m = (this.props.width - margin.left - margin.right)/2,
          height_m = this.props.height - margin.top - margin.bottom;

      const xScaleLeft = d3.scaleLinear()
        .domain([0, d3.max([...leftData,...rightData])])
        .range([0, width_m]);

      const xAxisScaleLeft = d3.scaleLinear()
        .domain([d3.max([...leftData,...rightData]), 0])
        .range([0, width_m]);

      const yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(names)])
        .range([10, height_m]);

      const xScaleRight = d3.scaleLinear()
         .domain([0, d3.max([...leftData,...rightData])])
         .range([0, width_m]);

      const bar_height = height_m / names.length

      return {
        xScaleLeft,
        xAxisScaleLeft,
        yAxisScale,
        xScaleRight,
        width_m,
        height_m,
        bar_height,
        names,
        leftData,
        rightData
      }

  }

  render(){
      const { id, data, width, height, highlightedPoint } = this.props;
      const { xScaleLeft, xAxisScaleLeft, yAxisScale, xScaleRight, width_m, height_m, bar_height, names, leftData, rightData } = this._chartComponents()
      const svgDimensions ={
        width_m,
        height_m,
        bar_height
      }

      let highlightMark, text, leftText, rightText;
      if (highlightedPoint.length !== 0) {
        highlightMark = <line x1={margin.left/2} x2={2*width_m+margin.left/2} y1={yAxisScale(highlightedPoint.distance)} y2={yAxisScale(highlightedPoint.distance)} stroke={"#212121"} strokeOpacity={0.8} strokeWidth={1} className='highlight-mark' />;
        const factor = Math.pow(10, 2);
        let d = data.filter(d=>d.distance === highlightedPoint.distance)
        // console.log(d)
        d = d[0]
        const leftShot = d.left;
        const lfg = d.left_fg*100
        const rightShot = d.right;
        const rfg = d.right_fg*100
        let lp, rp;

        switch(id){
          case 'fg_bar':
            lp = "Left: " + Math.round(lfg * factor) / factor + "%";
            break;
          case 'freq_bar':
            lp = "Left: " + leftShot;
            break;
        }


        switch(id){
          case 'fg_bar':
            rp = "Right: " + Math.round(rfg * factor) / factor + "%";
            break;
          case 'freq_bar':
            rp = "Right: " + rightShot;
            break;
        }
        if(highlightedPoint.distance === 0){
          leftText = <text x={30} y={yAxisScale(highlightedPoint.distance)+15}> {lp} </text>
          rightText = <text x={200} y={yAxisScale(highlightedPoint.distance)+15}> {rp} </text>
        }
        else{
          leftText = <text x={30} y={yAxisScale(highlightedPoint.distance)-5}> {lp} </text>
          rightText = <text x={200} y={yAxisScale(highlightedPoint.distance)-5}> {rp} </text>
        }
      }

      return(
          <div className={id}>
            <svg ref='svg' width={width} height={height} className='chart bar-chart' translate={"translate(" + 20 + "," + 20 + ")"}>
              <Bars
                rl = "left"
                scales={{ xScaleLeft, xAxisScaleLeft, yAxisScale, xScaleRight }}
                margins={margin}
                data={leftData}
                // maxValue={maxValue}
                svgDimensions={svgDimensions}
              />
              <Bars
                rl = "right"
                scales={{ xScaleLeft, xAxisScaleLeft, yAxisScale, xScaleRight }}
                margins={margin}
                data={rightData}
                // maxValue={maxValue}
                svgDimensions={svgDimensions}
              />
              {highlightMark}
              {leftText}
              {rightText}
              <XYAxis xScaleLeft={xAxisScaleLeft} xScaleRight={xScaleRight} yScale={yAxisScale} svgDimensions={svgDimensions} {...this.props} />
            </svg>
          </div>
      );
  }
}
export default BarChart
