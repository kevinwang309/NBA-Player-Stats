import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Image , Button} from 'semantic-ui-react';
import LineChart from './LineChart'
import ScatterPlot from './ScatterPlot';
import shotData from './../data/harden_shot.json';
import shotDataAll from './../data/harden_shot.json';
import Stats from './../data/harden_stats.json';
import Shot_Freq from './../data/shot_freq_harden.json';

const settings = {
  width: 400,
  height: 400,
  padding: 30
};

let player_id = "201935"//Harden
const url = "http://stats.nba.com/media/players/230x185/"+player_id+".png"


class Player extends Component {
  render() {
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
            <Button>Made</Button>
            <Button.Or/>
            <Button>Missed</Button>
          </Button.Group>
          <ScatterPlot data={shotData} {...settings} />
        </div>
        <div className="FG">
          <LineChart id="fg" data={Shot_Freq} width={400} height={250}/>

        </div>
        <div className="Freq">
          <LineChart id="freq" data={Shot_Freq} width={400} height={250}/>
        </div>
      </div>
    );
  }
}
Player.propTypes = {
};

export default Player;
