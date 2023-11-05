import { Button, Group, Modal, Stepper } from '@mantine/core'
import { useState } from 'react'
import { JiraProjectRoleActorManager } from './jira/JiraProjectRoleActorManagement'
import { JiraGroupsCreationForm } from './jira/JiraGroupsCreationForm'
import { JiraProjectCategoriesCreationForm } from './jira/JiraProjectCategoriesCreationForm'
import { JiraProjectsCreationForm } from './jira/JiraProjectsCreationForm'
import { ConfluenceSpaceCreationForm } from './confluence/ConfluenceSpaceCreationForm'
import { ConfluenceSpacePermissionAssignmentForm } from './confluence/ConfluenceSpacePermissionAssignmentForm'
import { JIRA_USER_GROUPS_MGMT } from '../../../service/jiraService'

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
      return current < 5 ? current + 1 : current
    })
  }
  const prevSetupStep = (): void => {
    setActiveSetupStep((current) => {
      return current > 0 ? current - 1 : current
    })
  }

  return (
    <Modal opened={opened} onClose={onClose} centered size='100%'>
      <Stepper active={activeSetupStep} onStepClick={setActiveSetupStep}>
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
        <Stepper.Step description='Create Coaches and Project Leads Confluence Spaces'>
          <ConfluenceSpaceCreationForm
            iosTag={iosTag}
            spaces={[
              { name: 'Coaches and Project Leads', key: 'COACHPL' },
              { name: 'CW', key: 'CW' },
            ]}
          />
        </Stepper.Step>
        <Stepper.Step description='Confluence Space Permissions'>
          <ConfluenceSpacePermissionAssignmentForm
            iosTag={iosTag}
            spaceKeys={[`${iosTag.toUpperCase()}COACHPL`, `${iosTag.toUpperCase()}CW`]}
            groupNameSuggestions={JIRA_USER_GROUPS_MGMT.map(
              (userGroup) => `${iosTag.toLowerCase()}${userGroup}`,
            )}
          />
        </Stepper.Step>
      </Stepper>
      <Group align='center' style={{ padding: '2vh 0' }}>
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
