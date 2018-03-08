import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import logo from '../nba-logo.svg';
import * as actions from './../actions'
import {Menu, Icon, Dropdown, Button, Flag, Image, Label} from 'semantic-ui-react'

class Header extends Component {
  render(){
    const {activeMenu, onSwitchMenu} = this.props
    return(
      <Menu size='tiny' fixed="top">
        <Menu.Item header>
          <img src={logo} className="App-logo" alt="logo" /> NBA Shooting Chart
        </Menu.Item>

        <Menu.Item name="Player" icon="user"
          active={activeMenu === "Player"}
          onClick={(e, {name}) => onSwitchMenu(name)}/>

        <Menu.Item name="Compare" icon="users"/>

        <Menu.Item name="League" icon="line chart"/>
      </Menu>
    )
  }
}

const mapStateToProps = (state) => {
  const {activeMenu} = state.header
  return {
    activeMenu
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSwitchMenu: bindActionCreators(actions.switchMenu, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
