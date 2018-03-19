import * as actionTypes from '../constants/actionTypes'

const initialState = {
  scatterDataName: "",
  scatterData: [],
  highlightedPoint : [],
  player : "JamesHarden",
  optimized: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.CHANGE_SCATTER_DATA:
      return changeScatterData(state, action)
    case actionTypes.SET_HIGHLIGHTED_POINT:
      return setHighlightedPoint(state, action)
    case actionTypes.CHANGE_PLAYER:
      return changePlayer(state, action)
      case actionTypes.SWITCH_DATA:
        return switchData(state, action)
  }
  return state
}

function changeScatterData(state, action) {
  const { scatterDataName, scatterData } = action;
  return { ...state, scatterDataName, scatterData };
}

function setHighlightedPoint(state, action) {
  const { highlightedPoint } = action;
  return { ...state, highlightedPoint };
}

function changePlayer(state, action) {
  const { player } = action;
  return { ...state, player };
}

function switchData(state, action) {
  const { optimized } = action;
  return { ...state, optimized };
}
