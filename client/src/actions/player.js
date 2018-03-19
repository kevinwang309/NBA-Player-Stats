import * as actionTypes from '../constants/actionTypes'
import * as actions from './index'

export function changeScatterData(scatterDataName, scatterData) {
  return {
    type: actionTypes.CHANGE_SCATTER_DATA,
    scatterDataName,
    scatterData
  }
}

export function setHighlightedPoint(highlightedPoint) {
  return {
    type: actionTypes.SET_HIGHLIGHTED_POINT,
    highlightedPoint
  }
}

export function changePlayer(event, player) {
  return {
    type: actionTypes.CHANGE_PLAYER,
    player: player.value
  }
}
