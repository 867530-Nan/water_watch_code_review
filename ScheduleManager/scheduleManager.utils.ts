import { Schedule, SchedulePriority } from '@blyncsy/common'
import { i18n } from '@blyncsy/i18n'
import moment, { Moment } from 'moment'
import { RouteComponentProps } from 'react-router'
import { ScheduleManagerFc } from '.'
import { PulseStore } from '../interfaces/General'
import { ScheduleCreationCc } from '../ScheduleCreation'
import { onNewScheduleSave } from './scheduleManager.actions'

export const scheduleManagerCallbackCreator = (
  store: PulseStore,
  container: ScheduleManagerFc
): ScheduleCreationCc => ({
  onFinish: () => store.dispatch(onNewScheduleSave(container)),
})

export const goToScheduleManager = (
  id: number,
  history: RouteComponentProps['history']
) => {
  const prevLocation = window.location.pathname
  history.push({
    pathname: `/pulse/schedule_manager/${id}`,
    state: { from: prevLocation },
  })
}

export const getExcludedDatesString = (dates: Moment[]) =>
  dates.map((date) => getReadableScheduleDate(date.toString())).join(', ')

export const getReadableScheduleDate = (date: string) => {
  const lang = navigator.language
  return new Date(date).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const sortScheduleMessages = (array: any[], sortBy: string) =>
  array.sort((a, b) => {
    if (a[sortBy] > b[sortBy]) return -1
    if (a[sortBy] < b[sortBy]) return 1
    return 0
  })

export const getReadablePriority = (priority: SchedulePriority) => {
  switch (priority) {
    case 0:
      return i18n.t('common:low')
    case 1:
      return i18n.t('common:medium')
    case 2:
      return i18n.t('common:high')
    case 3:
      return i18n.t('common:emergency')
  }
}

export const getReadableScheduleTime = (date: string) => {
  const lang = navigator.language
  return new Date(date).toLocaleTimeString(lang, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const isScheduleNow = (schedule: Schedule): boolean => {
  const timeFormat = 'HH:mm:ss'
  const now = moment()
  if (now.isBetween(schedule.startDate, schedule.endDate)) {
    if (schedule.startTime && schedule.endTime) {
      const nowDate = moment().format('YYYY-MM-DD')
      const formStart = moment(schedule.startTime).format(timeFormat)
      const newStartTime = `${nowDate}T${formStart}`
      const formEnd = moment(schedule.endTime).format(timeFormat)
      const newEndTime = `${nowDate}T${formEnd}`
      return moment().isBetween(newStartTime, newEndTime)
    }
    return true
  }
  return false
}

export const goToSignManager = (
  history: RouteComponentProps['history'],
  toLocation: string
) => {
  history.push(toLocation)
}
