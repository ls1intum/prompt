import { Button, Group, Modal, Stepper } from '@mantine/core'
import { useState } from 'react'
import { JiraProjectRoleActorManager } from './jira/JiraProjectRoleActorManagement'
import { JiraGroupsCreationForm } from './jira/JiraGroupsCreationForm'
import { JiraProjectCategoriesCreationForm } from './jira/JiraProjectCategoriesCreationForm'
import { JiraProjectsCreationForm } from './jira/JiraProjectsCreationForm'

interface ManagementSetupModalProps {
  opened: boolean
  onClose: () => void
  iosTag: string
}

export const ManagementSetupModal = ({
  opened,
  onClose,
  iosTag,
}: ManagementSetupModalProps): JSX.Element => {
  const [activeSetupStep, setActiveSetupStep] = useState(0)
  const nextSetupStep = (): void => {
    setActiveSetupStep((current) => {
      return current < 3 ? current + 1 : current
    })
  }
  const prevSetupStep = (): void => {
    setActiveSetupStep((current) => {
      return current > 0 ? current - 1 : current
    })
  }

  return (
    <Modal opened={opened} onClose={onClose} centered size='100%'>
      <Stepper active={activeSetupStep} onStepClick={setActiveSetupStep} breakpoint='lg'>
        <Stepper.Step description='Create Jira User Groups'>
          <JiraGroupsCreationForm iosTag={iosTag} mode='mgmt' />
        </Stepper.Step>
        <Stepper.Step description='Create Jira Project Categories'>
          <JiraProjectCategoriesCreationForm iosTag={iosTag} mode='mgmt' />
        </Stepper.Step>
        <Stepper.Step description='Create Jira Projects'>
          <JiraProjectsCreationForm iosTag={iosTag} mode='mgmt' />
        </Stepper.Step>
        <Stepper.Step description='Add Project Role Actors'>
          <JiraProjectRoleActorManager iosTag={iosTag} />
        </Stepper.Step>
      </Stepper>
      <Group position='center' style={{ padding: '2vh 0' }}>
        <Button variant='outline' onClick={prevSetupStep}>
          Back
        </Button>
        <Button variant='filled' onClick={nextSetupStep}>
          Next
        </Button>
      </Group>
    </Modal>
  )
}
