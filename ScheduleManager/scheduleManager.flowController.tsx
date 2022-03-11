import * as React from 'react'

import { themes } from '@blyncsy/common'

import { getExampleStepContent } from './scheduleManager.content'

import {
  configureScheduleManager,
  initScheduleManager,
} from './scheduleManager.actions'

import { TwoWordLogo } from '@blyncsy/react'
import { PulseFlowControllerService } from '../FlowController'
import { i18n } from '@blyncsy/i18n'
import { ScheduleCreationFc } from '../ScheduleCreation'
import { scheduleManagerCallbackCreator } from './scheduleManager.utils'

export enum ScheduleManagerSteps {
  list = 'list',
  new = 'new',
}

export const getScheduleManagerFc = (container: {
  flowControllerService: PulseFlowControllerService
  scheduleCreationFc: ScheduleCreationFc
}) =>
  container.flowControllerService.getFlowController<ScheduleManagerSteps>({
    id: 'scheduleManager',
    name: i18n.t('common:thingManager', { thing: i18n.t('common:schedule') }),
    isSequential: false,
    includeUrlHashTracking: true,
    theme: themes.light,
    logo: <TwoWordLogo firstWord="Schedule" secondWord="Manager" />,
    steps: [
      {
        id: ScheduleManagerSteps.list,
        name: i18n.t('common:list'),
        svgIcon: 'map',
        renderer: getExampleStepContent,
      },
      {
        id: ScheduleManagerSteps.new,
        name: 'Schedule Creation',
        svgIcon: 'pencil',
        subFlowController: container.scheduleCreationFc,
        displayStyle: 'nested',
        isExpanded: true,
        callbackCreator: scheduleManagerCallbackCreator,
      },
    ],
    onMount: initScheduleManager,
    customConfiguration: configureScheduleManager,
  })
