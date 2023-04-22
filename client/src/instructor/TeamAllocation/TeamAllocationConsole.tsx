import { Tabs } from '@mantine/core'
import { ProjectTeamsManager } from './components/ProjectTeamsManager/ProjectTeamsManager'
import { IconListNumbers, IconUsers } from '@tabler/icons-react'
import { StudentProjectTeamPreferencesManager } from './components/StudentProjectTeamPreferencesManager/StudentProjectTeamPreferencesManager'

export const TeamAllocationConsole = (): JSX.Element => {
  return (
    <Tabs defaultValue='teams' variant='outline'>
      <Tabs.List>
        <Tabs.Tab value='teams' icon={<IconUsers />}>
          Project Teams Management
        </Tabs.Tab>
        <Tabs.Tab value='preferences' icon={<IconListNumbers />}>
          Student Project Team Preferences
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='teams'>
        <ProjectTeamsManager />
      </Tabs.Panel>
      <Tabs.Panel value='preferences'>
        <StudentProjectTeamPreferencesManager />
      </Tabs.Panel>
    </Tabs>
  )
}
