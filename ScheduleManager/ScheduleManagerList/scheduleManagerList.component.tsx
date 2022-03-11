import * as React from 'react'

import {
  Button,
  CollectionTable,
  ConfirmationButton,
  CSSLibrary,
  getCellComponent,
  LoadingPlaceholder,
} from '@blyncsy/react'

import { connect } from 'react-redux'

import { ApplicationState } from '../../interfaces/ApplicationState'
import { ThemeLegend, Sign, Schedule } from '@blyncsy/common'
import {
  getReadableScheduleDate,
  goToSignManager,
} from '../scheduleManager.utils'
import { useTranslation } from '@blyncsy/i18n'
import { RouteComponentProps, withRouter } from 'react-router'

const ScheduleManagerList: React.FunctionComponent<ScheduleManagerListProps> = ({
  theme,
  isLoading,
  schedules,
  relatedSign,
  onNewMessage,
  onSelect,
  onEdit,
  onDelete,
  onUnMount,
  history,
  location,
}) => {
  React.useEffect(() => onUnMount, [])
  const [fromLocation, setFromLocation] = React.useState<string>('')
  React.useEffect(() => {
    setFromLocation(
      // @ts-ignore
      location.state ? location.state.from : '/pulse/sign_manager'
    )
  }, [])
  const { t } = useTranslation('pulse')
  const getTrProps = () => ({
    style: {
      alignItems: 'center',
    },
  })
  const getBackToString = () =>
    fromLocation.includes('atms') ? t('backToCerebro') : t('backToSignManager')
  if (relatedSign) {
    return (
      <div style={getRootStyles(theme)}>
        <div style={styles.headerNewWrap}>
          <h2 style={styles.title}>All Schedules for {relatedSign.name}</h2>
          <Button
            label={t('common:new')}
            theme={theme}
            onClick={onNewMessage}
            style={{
              height: 33,
              backgroundColor: theme.mainBackground,
              color: theme.mainFont,
            }}
          />
        </div>
        <CollectionTable
          theme={theme}
          data={schedules}
          loading={isLoading}
          defaultPageSize={10}
          sorted={[{ id: 'name', desc: false }]}
          getTrProps={getTrProps}
          columns={[
            {
              Header: t('common:name'),
              id: 'name',
              accessor: 'name',
            },
            {
              Header: t('common:startDate'),
              id: 'startDate',
              Cell: getCellComponent(
                ({ original }: { original: Schedule }) => (
                  <div>
                    {getReadableScheduleDate(original.startDate.toString())}
                  </div>
                ),
                'startDateColumn'
              ),
            },
            {
              Header: t('common:endDate'),
              id: 'endDate',
              Cell: getCellComponent(
                ({ original }: { original: Schedule }) => (
                  <div>
                    {original.endDate
                      ? getReadableScheduleDate(original.endDate.toString())
                      : t('common:n_a')}
                  </div>
                ),
                'endDateColumn'
              ),
            },
            {
              Header: '',
              width: 80,
              style: { textAlign: 'center' },
              Cell: getCellComponent(
                ({ original }: { original: Schedule }) => (
                  <Button
                    label={t('common:details')}
                    theme={theme}
                    onClick={() => original.id && onSelect(original.id)}
                  />
                ),
                'OnEditComponent'
              ),
            },
            {
              Header: '',
              width: 80,
              style: { textAlign: 'center' },
              Cell: getCellComponent(
                ({ original }: { original: Schedule }) => (
                  <Button
                    label={t('common:edit')}
                    theme={theme}
                    onClick={() => original.id && onEdit(original.id)}
                  />
                ),
                'OnEditComponent'
              ),
            },
            {
              Header: '',
              width: 80,
              style: { textAlign: 'center' },
              Cell: getCellComponent(
                ({ original }: { original: Schedule }) => (
                  <ConfirmationButton
                    label={t('common:delete')}
                    theme={theme}
                    confirmationText={t('common:confirmItemDelete', {
                      itemType: t('common:message'),
                      itemName: original.name,
                    })}
                    onConfirm={() => original.id && onDelete(original.id)}
                  />
                ),
                'OnDeleteComponent'
              ),
            },
          ]}
        />
        <div style={{ margin: '10px 0' }}>
          <Button
            onClick={() => goToSignManager(history, fromLocation)}
            label={getBackToString()}
            type={Button.types.success}
          />
        </div>
      </div>
    )
  }
  return <LoadingPlaceholder text={t('initializing')} />
}

const styles: CSSLibrary = {
  root: {
    padding: '1.5em',
  },
  title: {
    marginTop: 0,
    marginBottom: 25,
  },
  editWrap: {
    marginRight: 5,
  },
  editCheckbox: {
    height: 15,
    width: 15,
  },
  clickableAnchor: {
    cursor: 'pointer',
    textAlign: 'center',
  },
  headerNewWrap: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}

const getRootStyles = (theme: ThemeLegend): React.CSSProperties => ({
  ...styles.root,
  color: theme.mainFont,
  background: theme.mainBackground,
})

interface OwnProps {
  theme: ThemeLegend
  schedules: Schedule[]
  onNewMessage: () => void
  onSelect: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onUnMount: () => void
  relatedSign?: Sign
}

interface PropsFromState {
  isLoading: boolean
}

interface ScheduleManagerListProps
  extends PropsFromState,
    RouteComponentProps,
    OwnProps {}

const mapStateToProps = (state: ApplicationState): PropsFromState => ({
  isLoading: state.metaDataState.schedules.loading,
})

export default connect<PropsFromState, unknown, OwnProps>(
  mapStateToProps,
  {}
)(withRouter(ScheduleManagerList))
