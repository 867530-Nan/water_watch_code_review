import { Reducer, isType } from '@blyncsy/common'
import {
  setAllSchedules,
  setSelectedSchedule,
  deselectSchedule,
  setScheduleSignId,
} from './scheduleManager.actions'
import { ScheduleManagerState } from './scheduleManager.interfaces'
import { injectReducer } from '@blyncsy/redux'

const initialState: ScheduleManagerState = {
  allSchedules: {},
  selectedSchedule: undefined,
  signId: undefined,
}

const scheduleManagerState: Reducer<ScheduleManagerState> = (
  state = initialState,
  action
) => {
  if (isType(action, setAllSchedules)) {
    return {
      ...state,
      allSchedules: action.payload.schedules,
    }
  }

  if (isType(action, setScheduleSignId)) {
    return {
      ...state,
      signId: action.payload.signId,
    }
  }

  if (isType(action, setSelectedSchedule)) {
    return {
      ...state,
      selectedSchedule: action.payload.id,
    }
  }

  if (isType(action, deselectSchedule)) {
    return {
      ...state,
      selectedSchedule: undefined,
    }
  }

  return state
}

export const injectScheduleManagerReducer = () =>
  injectReducer('scheduleManagerState', scheduleManagerState)
