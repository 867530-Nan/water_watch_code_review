import * as React from 'react'

import { Schedule, ThemeLegend } from '@blyncsy/common'
import { useTranslation } from '@blyncsy/i18n'
import { CardStackedHeaderBody } from '@blyncsy/react'
import ScheduleDetailsContent from '../ScheduleDetailsContent'
import ScheduleMessagesContent from '../ScheduleMessagesContent'

const SelectedScheduleDetails: React.FunctionComponent<SelectedScheduleDetailsProps> = ({
  theme,
  selectedSchedule,
  onClose,
}) => {
  const { t } = useTranslation('common')
  return (
    <CardStackedHeaderBody
      theme={theme}
      onClick={onClose}
      title={t('details')}
      headerTextSize="large"
      bodyContent={
        <>
          <ScheduleDetailsContent theme={theme} schedule={selectedSchedule} />
          <ScheduleMessagesContent theme={theme} />
        </>
      }
    />
  )
}

interface SelectedScheduleDetailsProps {
  theme: ThemeLegend
  onClose?: () => void
  selectedSchedule: Schedule
}

export default SelectedScheduleDetails
