import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react';

import * as actions from './../actions';
import LineChartV2 from './LineChartV2';
import ScatterPlot from './ScatterPlotCompare';
import BarChartV2 from './BarChartV2';

import ShootingData from './../data/filter.json'
import rawShootingData from './../data/origin_combine.json'

import JamesHardenStats from './../data/JamesHarden/stats.json';
import JamesHardenShots from './../data/JamesHarden/shot_all.json';
import JamesHardenShotsSample from './../data/JamesHarden/shot_all_sample.json'
import JamesHardenShot_Freq_Distance from './../data/JamesHarden/shot_freq_distance.json';
import JamesHardenShot_Freq from './../data/JamesHarden/shot_freq.json';

import LeBronJamesStats from './../data/LeBronJames/stats.json';
import LeBronJamesShots from './../data/LeBronJames/shot_all.json';
import LeBronJamesShotsSample from './../data/LeBronJames/shot_all_sample.json'
import LeBronJamesShot_Freq_Distance from './../data/LeBronJames/shot_freq_distance.json';
import LeBronJamesShot_Freq from './../data/LeBronJames/shot_freq.json';

import StephenCurryStats from './../data/StephenCurry/stats.json';
import StephenCurryShots from './../data/StephenCurry/shot_all.json';
import StephenCurryShotsSample from './../data/StephenCurry/shot_all_sample.json'
import StephenCurryShot_Freq_Distance from './../data/StephenCurry/shot_freq_distance.json';
import StephenCurryShot_Freq from './../data/StephenCurry/shot_freq.json';

import DeMarDeRozanStats from './../data/DeMarDeRozan/stats.json';
import DeMarDeRozanShots from './../data/DeMarDeRozan/shot_all.json';
import DeMarDeRozanShotsSample from './../data/DeMarDeRozan/shot_all_sample.json'
import DeMarDeRozanShot_Freq_Distance from './../data/DeMarDeRozan/shot_freq_distance.json';
import DeMarDeRozanShot_Freq from './../data/DeMarDeRozan/shot_freq.json';

class Compare extends Component {

  render() {
    const {scatterDataName, scatterData, changeScatterData , switchData, optimized, setHighlightedPoint, highlightedPoint} = this.props
    return (
      <div className="compare">
        <div className="shotChart">
          <Button.Group>
            <Button name="raw" onClick={(e, {name}) => changeScatterData(name, [rawShootingData])}>Raw Data</Button>
            <Button.Or/>
            <Button name="optimized" onClick={(e, {name}) => changeScatterData(name, [ShootingData])}>Optimized Data</Button>
          </Button.Group>
          <ScatterPlot data={scatterData} d_data={JamesHardenShot_Freq_Distance} dataName={scatterDataName} padding={30} radiusKey='distance' setHighlightedPoint={setHighlightedPoint} highlightedPoint={highlightedPoint}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {scatterDataName, scatterData, highlightedPoint, player, optimized} = state.player
  return {
    scatterDataName,
    scatterData,
    highlightedPoint,
    player,
    optimized
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeScatterData: bindActionCreators(actions.changeScatterData, dispatch),
    setHighlightedPoint: bindActionCreators(actions.setHighlightedPoint, dispatch),
    changePlayer: bindActionCreators(actions.changePlayer, dispatch),
    switchData: bindActionCreators(actions.switchData, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
