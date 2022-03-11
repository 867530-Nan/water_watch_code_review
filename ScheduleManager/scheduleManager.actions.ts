import {
  actionCreator,
  arrayToDictionary,
  mdSetLoading,
  ScheduledMessageConfig,
  ScheduledMessageConfigObj,
} from '@blyncsy/common'
import { i18n } from '@blyncsy/i18n'
import { showFlash } from '@blyncsy/user_notifications'
import { batchActions } from 'redux-batched-actions'
import { ScheduleManagerFc, ScheduleManagerSteps } from '.'
import { PulseThunkCreator } from '../interfaces/General'
import { MetaDataNames } from '../interfaces/MetaData'
import { daos } from '../pulse.daos'
import { streamSigns } from '../_signs'
import { SchedulesObj } from './scheduleManager.interfaces'
import { getAllMessages } from '../MessageManager'
import {
  selectInitialEndDate,
  selectInitialEndTime,
  selectInitialStartTime,
  setScheduleCreationBulkMessages,
  setScheduleCreationName,
  setScheduleDows,
  setScheduleEndTime,
  setScheduleCreationId,
  setScheduleExcludedDates,
  setScheduleStartDate,
  setScheduleStartTime,
  setScheduleTimeRestriction,
  setScheduleEndDate,
  resetScheduleCreation,
} from '../ScheduleCreation'
import { selectAllSchedules } from './scheduleManager.selectors'
import { getRouteGroups } from '../MessageCreation'

enum ScheduleManagerActionTypes {
  SET_ALL_SCHEDULE_MANAGER_SCHEDULES = 'SET_ALL_SCHEDULE_MANAGER_SCHEDULES',
  SET_SELECTED_SCHEDULE = 'SET_SELECTED_SCHEDULE',
  DESELECT_SCHEDULE = 'DESELECT_SCHEDULE',
  SET_SCHEDULE_SIGN_ID = 'SET_SCHEDULE_SIGN_ID',
}

export const setAllSchedules = actionCreator<{
  schedules: SchedulesObj
}>(ScheduleManagerActionTypes.SET_ALL_SCHEDULE_MANAGER_SCHEDULES)

export const setSelectedSchedule = actionCreator<{
  id: number
}>(ScheduleManagerActionTypes.SET_SELECTED_SCHEDULE)

export const deselectSchedule = actionCreator<void>(
  ScheduleManagerActionTypes.DESELECT_SCHEDULE
)

export const setScheduleSignId = actionCreator<{ signId: number }>(
  ScheduleManagerActionTypes.SET_SCHEDULE_SIGN_ID
)

export const initScheduleManager: PulseThunkCreator<[ScheduleManagerFc]> = ({
  actions,
}) => (dispatch, getState) => {
  const state = getState()
  if (state.signState.allSigns.length === 0) {
    dispatch(streamSigns())
  }
  dispatch(getRouteGroups())
  const currentStep = window.location.href.split('#')[1]
  if (currentStep && currentStep === 'new') {
    dispatch(
      batchActions(
        [
          actions.setActiveStep(ScheduleManagerSteps.list),
          actions.displayStep(ScheduleManagerSteps.list),
        ],
        'INITIALIZE_NEW_STEPS'
      )
    )
  }

  const currentId = window.location.pathname
    .split('/')
    .filter((e) => e)
    .pop() as string

  dispatch(getAllSchedules(parseInt(currentId)))
  dispatch(setScheduleSignId({ signId: parseInt(currentId) }))
  dispatch(getAllMessages())
}

export const configureScheduleManager: PulseThunkCreator<[
  ScheduleManagerFc
]> = (container) => (dispatch, getState) => {
  dispatch(container.actions.hideStep(ScheduleManagerSteps.new))
  dispatch(deselectSchedule())
}

export const getAllSchedules: PulseThunkCreator<[number, any?]> = (
  signId,
  callback
) => (dispatch, getState) => {
  const state = getState()
  dispatch(
    mdSetLoading({
      loading: true,
      dataName: MetaDataNames.schedules,
    })
  )
  daos.schedules
    .get({ projectId: state.currentProject.id, signId })
    .then((res) => {
      const schedules = arrayToDictionary(
        res,
        // @ts-ignore
        'id'
      ) as SchedulesObj
      dispatch(setAllSchedules({ schedules }))
      callback && callback()
    })
    .catch((err) => {
      console.log('error')
      console.log(err)
      dispatch(
        showFlash({
          type: 'error',
          content: i18n.t('common:itemLoadError', {
            itemName: i18n.t('common:schedule_plural'),
          }),
          debugInfo: {
            requestErr: JSON.stringify(err),
          },
        })
      )
    })
    .finally(() => {
      dispatch(
        mdSetLoading({
          loading: false,
          dataName: MetaDataNames.schedules,
        })
      )
    })
}

export const newScheduleClick: PulseThunkCreator<[ScheduleManagerFc]> = (
  container
) => (dispatch, getState) => {
  dispatch(
    batchActions(
      [
        container.actions.displayStep(ScheduleManagerSteps.new),
        container.actions.setActiveStep(ScheduleManagerSteps.new),
        resetScheduleCreation(),
      ],
      'NEW_SCHEDULE_CLICK'
    )
  )
}

export const onNewScheduleSave: PulseThunkCreator<[ScheduleManagerFc]> = ({
  actions,
}) => (dispatch, getState) => {
  const state = getState()
  const { signId } = state.scheduleManagerState
  dispatch(
    batchActions(
      [
        actions.hideStep(ScheduleManagerSteps.new),
        actions.displayStep(ScheduleManagerSteps.list),
        actions.setActiveStep(ScheduleManagerSteps.list),
      ],
      'NEW_SCHEDULE_CLICK'
    )
  )
  dispatch(getAllSchedules(signId as number))
}

export const onScheduleSelect: PulseThunkCreator<[number]> = (id) => (
  dispatch,
  getState
) => {
  dispatch(setSelectedSchedule({ id }))
}

export const onScheduleEdit: PulseThunkCreator<[ScheduleManagerFc, number]> = (
  { actions },
  id
) => (dispatch, getState) => {
  const state = getState()
  const currentSchedule = selectAllSchedules(state)[id]
  const {
    startDate,
    startTime,
    endDate,
    endTime,
    name,
    excludedDates,
    dows,
    messages,
  } = currentSchedule

  const messageConfigs = messages.map((msg) => ({
    priority: msg.priority,
    message_id: msg.id,
  })) as ScheduledMessageConfig[]

  const configs = arrayToDictionary(
    messageConfigs,
    'message_id'
  ) as ScheduledMessageConfigObj

  const initStartTime = startTime || selectInitialStartTime(state)
  const initEndTime = endTime || selectInitialEndTime(state)
  const initEndDate = endDate || selectInitialEndDate(state)

  dispatch(
    batchActions(
      [
        setScheduleStartDate({ startDate }),
        setScheduleCreationName({ name }),
        setScheduleTimeRestriction({ shouldRestrict: true }),
        setScheduleStartTime({ startTime: initStartTime }),
        setScheduleEndTime({ endTime: initEndTime }),
        setScheduleEndDate({ endDate: initEndDate }),
        setScheduleExcludedDates({ excludedDates }),
        setScheduleDows({ dows }),
        setScheduleCreationBulkMessages({
          configs,
        }),
        setScheduleCreationId({ id }),
        actions.displayStep(ScheduleManagerSteps.new),
        actions.setActiveStep(ScheduleManagerSteps.new),
      ],
      'SCHEDULE_EDIT_PREP'
    )
  )
}

export const deleteSchedule: PulseThunkCreator<[number]> = (id) => (
  dispatch,
  getState
) => {
  const state = getState()
  const signId = state.scheduleManagerState.signId
  daos.schedules
    .delete(id)
    .then((res) => {
      dispatch(
        showFlash({
          type: 'success',
          content: i18n.t('common:deleteItemSuccess', {
            itemType: i18n.t('common:schedule'),
          }),
        })
      )
      dispatch(getAllSchedules(signId as number))
    })
    .catch((err) => {
      dispatch(
        showFlash({
          type: 'error',
          content: i18n.t('errorSavingItem', {
            item: i18n.t('common:schedule'),
          }),
        })
      )
    })
}
