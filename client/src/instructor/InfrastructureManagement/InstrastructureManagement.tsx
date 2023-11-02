import { Button, Card, Center, SimpleGrid, Stack, Title } from '@mantine/core'
import { useState } from 'react'
import { useAppSelector } from '../../redux/store'
import { ManagementSetupModal } from './components/ManagementSetupModal'
import { IconSettings } from '@tabler/icons-react'
import { IntroCourseSetupStepper } from './components/IntroCourseSetupStepper'
import { TeamAssignmentModal } from './components/TeamAssignmentModal'
import { TeamsSetupStepper } from './components/TeamSetupStepper'

export const InfrastructureManagement = (): JSX.Element => {
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const [mgmtSetupStepperOpened, setMgmtSetupStepperOpened] = useState(false)
  const [introCourseSetupStepperOpened, setIntroCourseSetupStepperOpened] = useState(false)
  const [teamAssignmentModalOpened, setTeamAssignmentModalOpened] = useState(false)
  const [teamsSetupStepperOpened, setTeamsSetupStepperOpened] = useState(false)

  const options = [
    {
      title: 'Management',
      component: (
        <>
          <Button
            leftSection={<IconSettings />}
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
            iosTag={selectedCourseIteration?.iosTag ?? ''}
          />
        </>
      ),
    },
    {
      title: 'Intro Course',
      component: (
        <>
          <Button
            leftSection={<IconSettings />}
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
            iosTag={selectedCourseIteration?.iosTag ?? ''}
          />
        </>
      ),
    },
    {
      title: 'Teams',
      component: (
        <>
          <Button
            leftSection={<IconSettings />}
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
            iosTag={selectedCourseIteration?.iosTag ?? ''}
          />
        </>
      ),
    },
    {
      title: 'Team Assignment',
      component: (
        <>
          <Button
            leftSection={<IconSettings />}
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
            iosTag={selectedCourseIteration?.iosTag ?? ''}
          />
        </>
      ),
    },
  ]

  return (
    <>
      <Stack>
        {selectedCourseIteration && (
          <SimpleGrid cols={2} style={{ padding: '20vh 10vw' }}>
            {options.map((option) => {
              return (
                <Card key={option.title} shadow='md' padding='lg' radius='md' withBorder>
                  <Stack>
                    <Center>
                      <Title order={4}>{option.title}</Title>
                    </Center>
                    {option.component}
                  </Stack>
                </Card>
              )
            })}
          </SimpleGrid>
        )}
      </Stack>
    </>
  )
}
