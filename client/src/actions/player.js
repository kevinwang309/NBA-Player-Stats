import * as actionTypes from '../constants/actionTypes'
import * as actions from './index'

export function changeScatterData(scatterDataName, scatterData) {
  return {
    type: actionTypes.CHANGE_SCATTER_DATA,
    scatterDataName,
    scatterData
  }
}
