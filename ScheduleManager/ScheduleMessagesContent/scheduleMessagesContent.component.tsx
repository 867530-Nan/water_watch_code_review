import * as React from 'react'

import { RefreshingDataTitle } from '@blyncsy/react'
import ScheduleDetailsMessagePreview from '../ScheduleDetailsMessagePreview'
import { ThemeLegend } from '@blyncsy/common'
import { useTranslation } from '@blyncsy/i18n'

const ScheduleMessagesContent: React.FunctionComponent<ScheduleMessagesContentProps> = ({
  theme,
}) => {
  const { t } = useTranslation('pulse')
  return (
    <div style={{ marginTop: 20 }}>
      <RefreshingDataTitle
        textSize="large"
        title={t('messagesForSchedule')}
        theme={theme}
      />
      <ScheduleDetailsMessagePreview theme={theme} />
    </div>
  )
}

interface ScheduleMessagesContentProps {
  theme: ThemeLegend
}

export default ScheduleMessagesContent
