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
          id="halfCourtCircle"
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
        <circle
          id="restrictedArea"
          cx={this.props.xScale(0)}
          cy={this.props.yScale(20)}
          r={this.props.xScale(40)-this.props.xScale(0)}
          strokeDasharray="5, 5"
          fillOpacity={0}
          stroke="black"
        />
        <circle
          id="hoop"
          cx={this.props.xScale(0)}
          cy={this.props.yScale(20)}
          r={this.props.xScale(7.5)-this.props.xScale(0)}
          fillOpacity={0}
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
  constructor(props){
    super(props);
    this.renderCircle = this.renderCircle.bind(this)
    // console.log(props)
  }
  renderCircle(coords) {
    if(this.props.dataName ===  "made"){
      if(coords.made === 0) return
    }
    if(this.props.dataName ===  "missed"){
      if(coords.made === 1) return
    }


    const color = (name) =>{
      console.log(name)
      switch(name.dataName){
        case "optimized":
          switch(coords.class) {
            case 0:
              return "#E57373";
            case 1:
              return "#90CAF9";
            case 2:
              return "#4CAF50";
            case 3:
              return "#FDD835";
          }
          break;
        case "raw":
          switch(coords.class) {
            case 0:
              return "#E57373";
            case 1:
              return "#90CAF9";
            case 2:
              return "#4CAF50";
            case 3:
              return "#FDD835";
          }
      }
    }
    return (
      <circle
       cx={this.props.xScale(coords.x)}
       cy={this.props.yScale(coords.y)}
       r={3}
       key={Math.random() * 1}
       fillOpacity={0.5}
       fill={color(this.props)}
      />
    );
  }

  render() {
    return <g>{this.props.data.map(data => data.map(this.renderCircle))}</g>
  }
}

class ScatterPlot extends Component {
  constructor(){
    super();
    this.state={width: 0, height: 0};
  }

  componentDidMount(){
    const width = parseInt(d3.select('#shotChart').style('width')),
        height = parseInt(d3.select('#shotChart').style('height'));
    this.setState({width: width, height: height})
  }

  getXScale(width) {
    // const xMax = d3.max(this.props.data, (d) => d.x);
    return d3.scaleLinear()
      .domain([-300, 300])
      .range([this.props.padding, (width - this.props.padding * 2)]);
  }

  getYScale(height) {
    // const yMax = d3.max(this.props.data, (d) => d.y);
    return d3.scaleLinear()
      .domain([-100, 500])
      .range([height - this.props.padding, this.props.padding]);
  }

  _handleHover(d) {
    const { setHighlightedPoint } = this.props;
    // send an action indicating which data point to highlight
    // setHighlightedPoint(d);
  }

  render() {
    const { d_data, radiusKey, highlightedPoint } = this.props;
    const width = this.state.width;
    const height = this.state.height;
    const xScale = this.getXScale(this.state.width)
    const yScale = this.getYScale(this.state.height)
    return (
      <div>
        {this.state.width !== 0 && this.state.height !== 0 ?
          <svg id="shotChart" preserveAspectRatio="xMinYMin meet" viewBox="0 0 400 400">
            <Court xScale={this.getXScale(this.state.width)} yScale={this.getYScale(this.state.height)}/>
            <DataCircles xScale={this.getXScale(this.state.width)} yScale={this.getYScale(this.state.height)} dataName={this.props.dataName} {...this.props} />
            {d_data.map((d, i) => {
              // console.log(d)
              // console.log(highlightedPoint[radiusKey])
              // set the highlight class name if this element is highlighted
              const className = highlightedPoint && d[radiusKey] === highlightedPoint[radiusKey] ? 'highlight' : '';
              return (
                <circle key={i} className={className} r={xScale(d[radiusKey]*10)-xScale(0)} cx={xScale(0)}
                        cy={yScale(20)} strokeWidth={4} fill="none"
                        onMouseOver={this._handleHover.bind(this, d)}
                        onMouseOut={this._handleHover.bind(this, null)}
                      />
             )
            })}
            <circle r={4} cx={xScale(-300)} cy={yScale(-50)} fill="#E57373"/><text x={xScale(-280)} y={yScale(-55)}>J. Harden</text>
            <circle r={4} cx={xScale(-120)} cy={yScale(-50)} fill="#90CAF9"/><text x={xScale(-100)} y={yScale(-55)}>S. Curry</text>
            <circle r={4} cx={xScale(60)} cy={yScale(-50)} fill="#4CAF50"/><text x={xScale(80)} y={yScale(-55)}>L. James</text>
            <circle r={4} cx={xScale(240)} cy={yScale(-50)} fill="#FDD835"/><text x={xScale(260)} y={yScale(-55)}>D. DeRozan</text>
          </svg>:
          <svg id="shotChart" preserveAspectRatio="xMinYMin meet" viewBox="0 0 400 400"></svg>
        }
      </div>
    );
  }
}

export default ScatterPlot
