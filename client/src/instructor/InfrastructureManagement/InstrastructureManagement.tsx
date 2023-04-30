import { Button, Group, Stack, Title } from '@mantine/core'
import { useState } from 'react'
import { useAppSelector } from '../../redux/store'
import { ManagementSetupModal } from './components/ManagementSetupModal'
import { IconSettings } from '@tabler/icons-react'
import { IntroCourseSetupStepper } from './components/IntroCourseSetupStepper'
import { TeamAssignmentModal } from './components/TeamAssignmentModal'
import { TeamsSetupStepper } from './components/TeamSetupStepper'

export const InfrastructureManagement = (): JSX.Element => {
  const selectedApplicationSemester = useAppSelector(
    (state) => state.applicationSemester.currentState,
  )
  const [mgmtSetupStepperOpened, setMgmtSetupStepperOpened] = useState(false)
  const [introCourseSetupStepperOpened, setIntroCourseSetupStepperOpened] = useState(false)
  const [teamAssignmentModalOpened, setTeamAssignmentModalOpened] = useState(false)
  const [teamsSetupStepperOpened, setTeamsSetupStepperOpened] = useState(false)

  return (
    <>
      <Stack>
        {selectedApplicationSemester && (
          <Group>
            <Title order={2}>Management</Title>
            <Button
              leftIcon={<IconSettings />}
              variant='filled'
              onClick={() => {
                setMgmtSetupStepperOpened(true)
              }}
            >
              Setup
            </Button>
            <ManagementSetupModal
              opened={mgmtSetupStepperOpened}
              onClose={() => {
                setMgmtSetupStepperOpened(false)
              }}
              iosTag={selectedApplicationSemester.iosTag}
            />
          </Group>
        )}
        {selectedApplicationSemester && (
          <Group>
            <Title order={2}>Intro Course</Title>
            <Button
              leftIcon={<IconSettings />}
              variant='filled'
              onClick={() => {
                setIntroCourseSetupStepperOpened(true)
              }}
            >
              Setup
            </Button>
            <IntroCourseSetupStepper
              opened={introCourseSetupStepperOpened}
              onClose={() => {
                setIntroCourseSetupStepperOpened(false)
              }}
              iosTag={selectedApplicationSemester.iosTag}
            />
          </Group>
        )}
        {selectedApplicationSemester && (
          <Group>
            <Title order={2}>Team Assignment</Title>
            <Button
              leftIcon={<IconSettings />}
              variant='filled'
              onClick={() => {
                setTeamAssignmentModalOpened(true)
              }}
            >
              Setup
            </Button>
            <TeamAssignmentModal
              opened={teamAssignmentModalOpened}
              onClose={() => {
                setTeamAssignmentModalOpened(false)
              }}
              iosTag={selectedApplicationSemester.iosTag}
            />
          </Group>
        )}
        {selectedApplicationSemester && (
          <Group>
            <Title order={2}>Teams</Title>
            <Button
              leftIcon={<IconSettings />}
              variant='filled'
              onClick={() => {
                setTeamsSetupStepperOpened(true)
              }}
            >
              Setup
            </Button>
            <TeamsSetupStepper
              opened={teamsSetupStepperOpened}
              onClose={() => {
                setTeamsSetupStepperOpened(false)
              }}
              iosTag={selectedApplicationSemester.iosTag}
            />
          </Group>
        )}
      </Stack>
    </>
  )
}
