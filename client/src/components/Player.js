import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Card, Image , Button} from 'semantic-ui-react';

import * as actions from './../actions';
import LineChart from './LineChart';
import ScatterPlot from './ScatterPlot';
import BarChart from './BarChart';
import shotData from './../data/harden_shot.json';
import shotDataMissed from './../data/harden_shot_missed.json';
import shotDataAll from './../data/harden_shot_all.json';
import Stats from './../data/harden_stats.json';
import Shot_Freq_Distance from './../data/harden_shot_freq_distance.json';
import Shot_Freq from './../data/harden_shot_freq.json';

const settings = {
  padding: 30
};

let player_id = "201935"//Harden
const url = "http://stats.nba.com/media/players/230x185/"+player_id+".png"


class Player extends Component {
  render() {
    const {scatterDataName, scatterData, changeScatterData} = this.props
    return (
      <div className="playerStats">
        <div className="stats">
          <Card>
            <Image src={url} size='medium'/>
            <Card.Content>
              <Card.Header>
                {Stats.NAME}
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
            <Button name="made" onClick={(e, {name}) => changeScatterData(name, [shotData])}>Made</Button>
            <Button.Or/>
            <Button name="missed" onClick={(e, {name}) => changeScatterData(name, [shotDataMissed])}>Missed</Button>
            <Button.Or/>
            <Button name="all" onClick={(e, {name}) => changeScatterData(name, [shotData, shotDataMissed])}>All</Button>
          </Button.Group>
          <ScatterPlot data={scatterData} dataName={scatterDataName} {...settings} />
        </div>
        <div className="FG">
          <LineChart id="fg_line" xKey='distance' yKey='percentage' data={Shot_Freq_Distance} />
          <BarChart id="fg_bar" data={Shot_Freq}/>
        </div>
        <div className="Freq">
          <LineChart id="freq_line" xKey='distance' yKey='freq' data={Shot_Freq_Distance}/>
          <BarChart id="freq_bar" data={Shot_Freq}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {scatterDataName, scatterData} = state.player
  return {
    scatterDataName,
    scatterData
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeScatterData: bindActionCreators(actions.changeScatterData, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
