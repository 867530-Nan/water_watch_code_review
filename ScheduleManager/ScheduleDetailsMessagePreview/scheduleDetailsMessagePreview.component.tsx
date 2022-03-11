import * as React from 'react'

import { Accordion, HorizontalRule } from '@blyncsy/react'

import { connect } from 'react-redux'

import { ApplicationState } from '../../interfaces/ApplicationState'

import { ThemeLegend, ScheduledMessageWithPriority } from '@blyncsy/common'
import MessageDetailsOverview from '../../_messages/MessageDetailsOverview'
import { selectMessageCreationRouteGroupLabel } from '../../MessageCreation'
import { getReadablePriority, sortScheduleMessages } from '..'
import { selectSelectedScheduledMessages } from '../scheduleManager.selectors'

const ScheduleDetailsMessagePreview: React.FunctionComponent<ScheduleDetailsMessagePreviewProps> = ({
  theme,
  messages,
  routeGroupName,
}) => {
  if (messages) {
    return (
      <>
        {sortScheduleMessages(messages, 'priority').map((message) => (
          <div key={message.name}>
            <Accordion title={message.name} textSize="regular">
              <MessageDetailsOverview
                theme={theme}
                message={message}
                priorityLevel={getReadablePriority(message.priority)}
                routeGroupName={routeGroupName}
                stackDetails
              />
            </Accordion>
            <HorizontalRule theme={theme} />
          </div>
        ))}
      </>
    )
  }
  return null
}

interface OwnProps {
  theme: ThemeLegend
}

interface PropsFromState {
  messages: ScheduledMessageWithPriority[]
  routeGroupName: string | undefined
}

interface ScheduleDetailsMessagePreviewProps extends OwnProps, PropsFromState {}

const mapStateToProps = (state: ApplicationState): PropsFromState => ({
  messages: selectSelectedScheduledMessages(state),
  routeGroupName: selectMessageCreationRouteGroupLabel(state),
})

export default connect<PropsFromState, unknown, OwnProps>(
  mapStateToProps,
  {}
)(ScheduleDetailsMessagePreview)
