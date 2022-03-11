import { Schedule } from '@blyncsy/common'
import { PulseContentRenderer, PulseFlowControllerIoc } from '../FlowController'

import { ScheduleManagerSteps } from './scheduleManager.flowController'

export type ScheduleManagerFc = PulseFlowControllerIoc<ScheduleManagerSteps>

export type ScheduleManagerContentRenderer = PulseContentRenderer<
  ScheduleManagerSteps
>

export type SchedulesObj = { [id: string]: Schedule }

export interface ScheduleManagerState {
  allSchedules: SchedulesObj
  selectedSchedule: number | undefined
  signId: number | undefined
}
