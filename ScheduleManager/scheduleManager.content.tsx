import { memoizedElement } from '@blyncsy/react'

import { ScheduleManagerContentRenderer } from './scheduleManager.interfaces'
import {
  deselectSchedule,
  newScheduleClick,
  onScheduleSelect,
  onScheduleEdit,
  deleteSchedule,
} from './scheduleManager.actions'
import ScheduleManagerList from './ScheduleManagerList'
import {
  selectAllSchedulesArray,
  selectScheduleManagerSelectedId,
  selectSelectedSchedule,
  selectCurrentScheduleSign,
} from './scheduleManager.selectors'
import SelectedScheduleDetails from './SelectedScheduleDetails'
import { Schedule } from '@blyncsy/common'

export const getExampleStepContent: ScheduleManagerContentRenderer = (
  store,
  container,
  callbacks
) => ({
  panels: [
    {
      id: 'mid',
      cards: [
        {
          id: 'mid',
          content: memoizedElement(ScheduleManagerList, {
            theme: container.theme,
            schedules: selectAllSchedulesArray(store.getState()) as Schedule[],
            onNewMessage: () => store.dispatch(newScheduleClick(container)),
            onSelect: (id) => store.dispatch(onScheduleSelect(id)),
            onEdit: (id) => store.dispatch(onScheduleEdit(container, id)),
            onUnMount: () => store.dispatch(deselectSchedule()),
            onDelete: (id) => store.dispatch(deleteSchedule(id)),
            relatedSign: selectCurrentScheduleSign(store.getState()),
          }),
        },
      ],
    },
    {
      id: 'post',
      isOpen: selectScheduleManagerSelectedId(store.getState()) !== undefined,
      size: '350px',
      cards: [
        {
          id: 'mid',
          content: memoizedElement(SelectedScheduleDetails, {
            selectedSchedule: selectSelectedSchedule(store.getState()),
            theme: container.theme,
            onClose: () => store.dispatch(deselectSchedule()),
          }),
        },
      ],
    },
  ],
  theme: container.theme,
})
