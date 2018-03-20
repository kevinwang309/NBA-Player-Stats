import React, { Component } from 'react';
import { connect } from 'react-redux'
import '../styles/App.css';

import Header from './Header'
import Player from './Player'
import Compare from './Compare'
import Intro from './Intro'

class App extends Component {
  render() {
    const { activeMenu } = this.props
    return (
      <div className="App">
        <Header/>
        {
          (() => {
            switch (activeMenu) {
              case 'Player':
                return <Player/>;
              case 'Compare':
                return <Compare/>
              default:
                return <Player/>;
            }
          })()
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { activeMenu } = state.header
  return {
    activeMenu
  }
}

export default connect(mapStateToProps)(App)
