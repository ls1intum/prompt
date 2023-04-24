import { Button, Divider, SimpleGrid, Stack, Title } from '@mantine/core'
import { IconCategory, IconTool, IconUser, IconUsers } from '@tabler/icons-react'
import { useState } from 'react'
import {
  JiraAddUserToUserGroupModal,
  JiraProjectCategoryCreationModal,
  JiraSetupModal,
  JiraUserGroupCreationModal,
} from './components/JiraSetupModal'

export const InfrastructureManagement = (): JSX.Element => {
  const [jiraProjectCategoryCreationModalOpened, setJiraProjectCategoryCreationModalOpened] =
    useState(false)
  const [jiraUserGroupCreationModalOpened, setJiraUserGroupCreationModalOpened] = useState(false)
  const [jiraAddUserToUserGroupModalOpened, setJiraAddUserToUserGroupModalOpened] = useState(false)
  const [jiraSetupModalOpened, setJiraSetupModalOpened] = useState(false)

  return (
    <>
      <Stack>
        <Title>Jira</Title>
        <SimpleGrid cols={2} style={{ padding: '5vh 0' }}>
          <Button
            variant='filled'
            leftIcon={<IconTool />}
            onClick={() => {
              setJiraSetupModalOpened(true)
            }}
          >
            Setup Jira Tools
          </Button>
          <Button
            variant='filled'
            leftIcon={<IconCategory />}
            onClick={() => {
              setJiraProjectCategoryCreationModalOpened(true)
            }}
          >
            Create Project Category
          </Button>
          <Button
            variant='filled'
            leftIcon={<IconUsers />}
            onClick={() => {
              setJiraUserGroupCreationModalOpened(true)
            }}
          >
            Create User Group
          </Button>
          <Button
            variant='filled'
            leftIcon={<IconUser />}
            onClick={() => {
              setJiraAddUserToUserGroupModalOpened(true)
            }}
          >
            Add User To User Group
          </Button>
        </SimpleGrid>
        <JiraProjectCategoryCreationModal
          opened={jiraProjectCategoryCreationModalOpened}
          onClose={() => {
            setJiraProjectCategoryCreationModalOpened(false)
          }}
        />
        <JiraSetupModal
          opened={jiraSetupModalOpened}
          onClose={() => {
            setJiraSetupModalOpened(false)
          }}
        />
        <JiraUserGroupCreationModal
          opened={jiraUserGroupCreationModalOpened}
          onClose={() => {
            setJiraUserGroupCreationModalOpened(false)
          }}
        />
        <JiraAddUserToUserGroupModal
          opened={jiraAddUserToUserGroupModalOpened}
          onClose={() => {
            setJiraAddUserToUserGroupModalOpened(false)
          }}
        />
      </Stack>
      <Divider />
    </>
  )
}
