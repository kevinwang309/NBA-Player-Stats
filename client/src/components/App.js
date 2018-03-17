import React, { Component } from 'react';
import { connect } from 'react-redux'
import '../styles/App.css';

import Header from './Header'
import Player from './Player'
import Intro from './Intro'

class App extends Component {
  render() {
    const { activeMenu } = this.props
    console.log(this.props)
    return (
      <div className="App">
        <Header/>
        {
          (() => {
            console.log(activeMenu)
            switch (activeMenu) {
              case 'Player':
                return <Player/>;
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
