import {
  arrayToDictionary,
  dictionaryToArray,
  Schedule,
  Sign,
} from '@blyncsy/common'
import { createSelector } from 'reselect'
import { isScheduleNow } from '.'
import { ApplicationState } from '../interfaces/ApplicationState'
import { GenericMessageObj, selectAllMessages } from '../MessageManager'
import { selectAllSigns, selectSelectedSignId } from '../_signs'
import { SchedulesObj } from './scheduleManager.interfaces'

export const selectAllSchedules = (state: ApplicationState) =>
  state.scheduleManagerState.allSchedules

export const selectAllSchedulesArray = (state: ApplicationState) =>
  dictionaryToArray(state.scheduleManagerState.allSchedules) as Schedule[]

const selectSchedulesSignId = (state: ApplicationState) =>
  state.scheduleManagerState.signId

export const selectScheduleManagerSelectedId = (state: ApplicationState) =>
  state.scheduleManagerState.selectedSchedule

export const selectSelectedSchedule = createSelector(
  selectScheduleManagerSelectedId,
  selectAllSchedules,
  (id: number, schedules: SchedulesObj) => schedules[id]
)

export const selectSelectedSignCurrentSchedules = createSelector(
  selectSelectedSignId,
  selectAllSchedulesArray,
  (id: number, schedules: Schedule[]) =>
    schedules.filter(
      (schedule) => schedule.signId === id && isScheduleNow(schedule)
    )
)

export const selectCurrentScheduleSign = createSelector(
  selectSchedulesSignId,
  selectAllSigns,
  (id: number, signs: Sign[]) => arrayToDictionary(signs, 'id')[id]
)

export const selectSelectedScheduledMessages = createSelector(
  selectAllMessages,
  selectSelectedSchedule,
  (allMessages: GenericMessageObj, schedule: Schedule) =>
    schedule?.messages.map((msg) => {
      const returnMessage = allMessages[msg.id as number]
      return {
        ...returnMessage,
        priority: msg.priority,
      }
    })
)
