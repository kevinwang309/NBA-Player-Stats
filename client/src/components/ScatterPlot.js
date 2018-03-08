import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import * as d3 from "d3";


class Court extends Component {
  render(){
    // console.log(this.props.xScale(-70))
    // console.log(this.props.yScale(300))
    // console.log(this.props.xScale(70))
    // console.log(this.props.yScale(-300))
    const d = "M " + this.props.xScale(-220) + " " + this.props.yScale(120) + " C " +
      this.props.xScale(-70) + " " + this.props.yScale(300) + " " +
      this.props.xScale(70) + " " + this.props.yScale(300) + " " +
      this.props.xScale(220) + " " + this.props.yScale(120);
    // console.log(d)

    return(
      <g>
        <rect
          id="outerlines"
          x={this.props.xScale(-250)}
          y={this.props.yScale(450)}
          width={this.props.xScale(500)-this.props.xScale(0)}
          height={this.props.yScale(-20)-this.props.yScale(450)}
          fillOpacity={0}
          stroke="black"
        />
        <rect
          id="outerBox"
          x={this.props.xScale(-80)}
          y={this.props.yScale(171)}
          width={this.props.xScale(160)-this.props.xScale(0)}
          height={this.props.yScale(-20)-this.props.yScale(171)}
          fillOpacity={0}
          stroke="black"
        />
        <rect
          id="innerBox"
          x={this.props.xScale(-60)}
          y={this.props.yScale(171)}
          width={this.props.xScale(120)-this.props.xScale(0)}
          height={this.props.yScale(-20)-this.props.yScale(171)}
          fillOpacity={0}
          stroke="black"
        />
        <circle
          id="freeThrowCircle"
          cx={this.props.xScale(0)}
          cy={this.props.yScale(171)}
          r={this.props.xScale(60)-this.props.xScale(0)}
          fillOpacity={0}
          stroke="black"
        />
        <circle
          id="haldCourtCircle"
          cx={this.props.xScale(0)}
          cy={this.props.yScale(450)}
          r={this.props.xScale(60)-this.props.xScale(0)}
          fillOpacity={0}
          stroke="black"
        />
        <line
          id="threeLeft"
          x1={this.props.xScale(-220)}
          y1={this.props.yScale(-20)}
          x2={this.props.xScale(-220)}
          y2={this.props.yScale(120)}
          stroke="black"
        />
        <line
          id="threeRight"
          x1={this.props.xScale(220)}
          y1={this.props.yScale(-20)}
          x2={this.props.xScale(220)}
          y2={this.props.yScale(120)}
          stroke="black"
        />
        <path id="threeArc" d={d} stroke="black" fillOpacity={0}/>
      </g>
    )
  }
}

class Axis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const node = ReactDOM.findDOMNode(this.refs.axisContainer);
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
    return (
      <g className="xy-axis">
        <Axis
          translate={`translate(0, ${this.props.height - this.props.padding})`}
          scale={this.props.xScale}
          orient="bottom"
        />
        <Axis
          translate={`translate(${this.props.padding}, 0)`}
          scale={this.props.yScale}
          orient="left"
        />
      </g>
    );
  }
}

class DataCircles extends Component {
  renderCircle(coords) {
    return (
      <circle
       cx={this.props.xScale(coords.x)}
       cy={this.props.yScale(coords.y)}
       r={3}
       key={Math.random() * 1}
       fillOpacity={0.8}
       fill={"#90CAF9"}
      />
    );
  }

  render() {
    return <g>{this.props.data.map(this.renderCircle.bind(this))}</g>
  }
}

class ScatterPlot extends Component {
  getXScale() {
    // const xMax = d3.max(this.props.data, (d) => d.x);

    return d3.scaleLinear()
      .domain([-300, 300])
      .range([this.props.padding, (this.props.width - this.props.padding * 2)]);
  }

  getYScale() {
    // const yMax = d3.max(this.props.data, (d) => d.y);

    return d3.scaleLinear()
      .domain([-20, 500])
      .range([this.props.height - this.props.padding, this.props.padding]);
  }

  render() {
    const xScale = this.getXScale();
    const yScale = this.getYScale();

    return (
      <svg width={this.props.width} height={this.props.height}>
        <Court xScale={xScale} yScale={yScale}/>
        <DataCircles xScale={xScale} yScale={yScale} {...this.props} />
        {/* <XYAxis xScale={xScale} yScale={yScale} {...this.props} /> */}
      </svg>
    );
  }
}

export default ScatterPlot
