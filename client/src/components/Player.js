import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Card, Checkbox, Dropdown, Image , Button, Icon} from 'semantic-ui-react';

import * as actions from './../actions';
// import LineChart from './LineChart';
import LineChartV2 from './LineChartV2';
import ScatterPlot from './ScatterPlot';
// import BarChart from './BarChart';
import BarChartV2 from './BarChartV2';


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



class Player extends Component {

  render() {
    const {scatterDataName, scatterData, changeScatterData, setHighlightedPoint, highlightedPoint, changePlayer, player, switchData, optimized} = this.props
    const playerOptions = [
      { key: 'JH', value: 'JamesHarden', text: 'James Harden' },
      { key: 'LB', value: 'LeBronJames', text: 'LeBron James' },
      { key: 'SC', value: 'StephenCurry', text: 'Stephen Curry' },
      { key: 'DD', value: 'DeMarDeRozan', text: 'DeMar DeRozan' },
    ]
    let Stats, Shots, Shot_Freq_Distance, Shot_Freq;

    switch(player){
      case "JamesHarden":
        Stats = JamesHardenStats;

        if(optimized) Shots = JamesHardenShotsSample
        else Shots = JamesHardenShots

        Shot_Freq_Distance = JamesHardenShot_Freq_Distance;
        Shot_Freq = JamesHardenShot_Freq;
        break;
      case "LeBronJames":
        Stats = LeBronJamesStats;

        if(optimized) Shots = LeBronJamesShotsSample
        else Shots = LeBronJamesShots

        Shot_Freq_Distance = LeBronJamesShot_Freq_Distance;
        Shot_Freq = LeBronJamesShot_Freq;
        break;
      case "StephenCurry":
        Stats = StephenCurryStats;

        if(optimized) Shots = StephenCurryShotsSample
        else Shots = StephenCurryShots

        Shot_Freq_Distance = StephenCurryShot_Freq_Distance;
        Shot_Freq = StephenCurryShot_Freq;
        break;
      case "DeMarDeRozan":
        Stats = DeMarDeRozanStats;

        if(optimized) Shots = DeMarDeRozanShotsSample
        else Shots = DeMarDeRozanShots

        Shot_Freq_Distance = DeMarDeRozanShot_Freq_Distance;
        Shot_Freq = DeMarDeRozanShot_Freq;
        break;
    }

    const url = "http://stats.nba.com/media/players/230x185/"+Stats.PLAYER_ID+".png"
    return (
      <div className="playerStats">
        <div className="stats">
          <Dropdown placeholder='Player' search selection options={playerOptions} onChange={changePlayer}/>
          <Card>
            <Image src={url} size='medium'/>
            <Card.Content>
              <Card.Header>
                {player}
              </Card.Header>
              <Card.Meta>
                <span className='date'>
                  {Stats.TEAM_ABBREVIATION} #{Stats.NUMBER}
                </span>
              </Card.Meta>
              <Card.Description>
                <div>PTS: <strong>{Stats.PTS}</strong></div>
                <div>MIN: <strong>{Stats.MIN}</strong></div>
                <div>GAMES: <strong>{Stats.GP}</strong></div>
                <br/>
                <div>FG%: <strong>{Stats.FG_PCT*100}%</strong></div>
                <div>FGA: <strong>{Stats.FGA}</strong></div>
                <div>FGM: <strong>{Stats.FGM}</strong></div>
                <br/>
                <div>3FG%: <strong>{Stats.FG3_PCT*100}%</strong></div>
                <div>3FGA: <strong>{Stats.FG3A}</strong></div>
                <div>3FGM: <strong>{Stats.FG3M}</strong></div>
              </Card.Description>
            </Card.Content>
            {/* <Card.Content extra>
            </Card.Content> */}
          </Card>
        </div>
        <div className="shotChart">
          <Button.Group>
            <Button name="made" onClick={(e, {name}) => changeScatterData(name, [Shots])}>Made</Button>
            <Button.Or/>
            <Button name="missed" onClick={(e, {name}) => changeScatterData(name, [Shots])}>Missed</Button>
            <Button.Or/>
            <Button name="all" onClick={(e, {name}) => changeScatterData(name, [Shots])}>All</Button>
          </Button.Group>
          <ScatterPlot data={scatterData} dataName={scatterDataName} d_data={Shot_Freq_Distance} padding={30} radiusKey='distance' setHighlightedPoint={setHighlightedPoint} highlightedPoint={highlightedPoint}/>
          <Checkbox toggle label={"Optimized Data"} onChange={(e,data) => switchData(data)}/>
        </div>
        <div className="FG">
          {/* <LineChart id="fg_line" xKey='distance' yKey='percentage' data={Shot_Freq_Distance} setHighlightedPoint={setHighlightedPoint} highlightedPoint={highlightedPoint}/> */}
          <LineChartV2 id="fg_line_FG" xKey='distance' yKey='percentage' width={300} height={180} data={Shot_Freq_Distance} setHighlightedPoint={setHighlightedPoint} highlightedPoint={highlightedPoint}/>
          <BarChartV2 id="fg_bar" width={300} height={300} data={Shot_Freq} setHighlightedPoint={setHighlightedPoint} highlightedPoint={highlightedPoint}/>
        </div>
        <div className="Freq">
          <LineChartV2 id="fg_line_Freq" xKey='distance' yKey='freq' width={300} height={180} data={Shot_Freq_Distance} setHighlightedPoint={setHighlightedPoint} highlightedPoint={highlightedPoint}/>
          {/* <LineChart id="freq_line" xKey='distance' yKey='freq' data={Shot_Freq_Distance} setHighlightedPoint={setHighlightedPoint} highlightedPoint={highlightedPoint}/> */}
          {/* <BarChart id="freq_bar" data={Shot_Freq}/> */}
          <BarChartV2 id="freq_bar" width={300} height={300} data={Shot_Freq} setHighlightedPoint={setHighlightedPoint} highlightedPoint={highlightedPoint}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Player)
