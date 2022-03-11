import * as React from 'react'

import { DataOverviewLine } from '@blyncsy/react'
import { Schedule, ThemeLegend } from '@blyncsy/common'
import { useTranslation } from '@blyncsy/i18n'
import { getDayAbbreviations } from '../../utils/tsUtils'
import {
  getExcludedDatesString,
  getReadableScheduleDate,
  getReadableScheduleTime,
} from '../scheduleManager.utils'

const ScheduleDetailsContent: React.FunctionComponent<ScheduleDetailsContentProps> = ({
  theme,
  schedule,
}) => {
  const { t } = useTranslation('common')
  const dataLines = schedule
    ? [
        { title: t('name'), data: schedule.name },
        {
          title: t('startDate'),
          data: getReadableScheduleDate(schedule.startDate.toString()),
        },
        {
          title: t('startTime'),
          data: schedule.startTime
            ? getReadableScheduleTime(schedule.startTime.toString())
            : t('none'),
        },
        {
          title: t('endDate'),
          data: schedule.endDate
            ? getReadableScheduleDate(schedule.endDate.toString())
            : t('none'),
        },
        {
          title: t('endTime'),
          data: schedule.endTime
            ? getReadableScheduleTime(schedule.endTime.toString())
            : t('none'),
        },
        { title: t('daysOfWeek'), data: getDayAbbreviations(schedule.dows) },
        {
          title: t('excludedDates'),
          overflow: true,
          data: schedule.excludedDates.length
            ? getExcludedDatesString(schedule.excludedDates)
            : t('none'),
        },
      ]
    : null
  return (
    <>
      {dataLines &&
        dataLines
          .filter((line) => line.data)
          .map((line, i) => (
            <div
              key={`DataOverviewLine-${i + 1}`}
              style={getSingleInfoStyles(theme)}
            >
              <DataOverviewLine title={line.title} data={line.data} textWrap />
            </div>
          ))}
    </>
  )
}

const getSingleInfoStyles = (theme: ThemeLegend): React.CSSProperties => ({
  margin: '3px auto',
  color: theme.mainFont,
  textTransform: 'capitalize',
})

interface ScheduleDetailsContentProps {
  theme: ThemeLegend
  schedule: Schedule
}

export default ScheduleDetailsContent
