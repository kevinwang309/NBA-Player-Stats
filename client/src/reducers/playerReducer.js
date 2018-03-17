import * as actionTypes from '../constants/actionTypes'

const initialState = {
  scatterDataName: "",
  scatterData: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.CHANGE_SCATTER_DATA:
      return changeScatterData(state, action)
  }
  return state
}

function changeScatterData(state, action) {
  const { scatterDataName, scatterData } = action;
  return { ...state, scatterDataName, scatterData };
}
