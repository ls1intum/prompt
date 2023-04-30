import { Button, FileInput, Group, Modal, MultiSelect, Stack, Stepper } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUpload } from '@tabler/icons-react'
import Papa from 'papaparse'
import { useState } from 'react'
import { JiraProjectCategoriesCreationForm } from './jira/JiraProjectCategoriesCreationForm'
import { JiraProjectsCreationForm } from './jira/JiraProjectsCreationForm'
import { JiraGroupsCreationForm } from './jira/JiraGroupsCreationForm'
import { BitbucketProjectsCreationForm } from './bitbucket/BitbucketProjectsCreationForm'
import { BambooProjectCreationForm } from './bamboo/BambooProjectCreationForm'
import { JiraPermissionManager } from './jira/JiraPermissionManager'
import { BitbucketPermissionsManager } from './bitbucket/BitbucketPermissionsManager'
import { ConfluenceSpaceCreationForm } from './confluence/ConfluenceSpaceCreationForm'

interface TeamsSetupStepperProps {
  opened: boolean
  onClose: () => void
  iosTag: string
}

export const TeamsSetupStepper = ({
  opened,
  onClose,
  iosTag,
}: TeamsSetupStepperProps): JSX.Element => {
  const [activeSetupStep, setActiveSetupStep] = useState(0)
  const nextSetupStep = (): void => {
    setActiveSetupStep((current) => {
      return current < 8 ? current + 1 : current
    })
  }
  const prevSetupStep = (): void => {
    setActiveSetupStep((current) => {
      return current > 0 ? current - 1 : current
    })
  }

  const [projects, setProjects] = useState<string[]>([])

  return (
    <Modal centered size='100%' opened={opened} onClose={onClose}>
      <Stepper active={activeSetupStep} onStepClick={setActiveSetupStep} breakpoint='lg'>
        <Stepper.Step description='Upload Projects File'>
          <Stack>
            <FileInput
              label='Projects'
              placeholder='Upload .csv file with projects'
              accept='.csv'
              icon={<IconUpload />}
              onChange={(file) => {
                if (file) {
                  Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    delimiter: ',',
                    complete: function (results: {
                      data: Array<{ Name: string }>
                      errors: Array<{ message: string; row: number }>
                    }) {
                      if (results.errors?.length > 0) {
                        notifications.show({
                          color: 'red',
                          autoClose: 5000,
                          title: 'Error',
                          message: `Failed to parse .csv due to error: ${results.errors[0].message}`,
                        })
                      }
                      const projectsFromCsv: string[] = []

                      results.data.forEach((data) => {
                        projectsFromCsv.push(data.Name)
                      })

                      setProjects(projectsFromCsv)
                      console.log(projectsFromCsv)
                    },
                  })
                }
              }}
            />
            <MultiSelect
              label='Projects'
              data={projects}
              placeholder='Select or type a project name to create'
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                setProjects((current) => [...current, query])
                return query
              }}
              value={projects}
              onChange={setProjects}
            />
          </Stack>
        </Stepper.Step>
        <Stepper.Step description='Create Jira Project Categories'>
          <JiraProjectCategoriesCreationForm
            mode='teams'
            initialProjectCategoriesToCreate={projects}
          />
        </Stepper.Step>
        <Stepper.Step description='Create Jira Projects'>
          <JiraProjectsCreationForm
            iosTag={iosTag}
            mode='teams'
            initialProjectsToCreate={projects.map((p) => {
              return {
                name: p,
                key: p,
                lead: '',
              }
            })}
          />
        </Stepper.Step>
        <Stepper.Step description='Create Jira User Groups'>
          <JiraGroupsCreationForm iosTag={iosTag} projectNames={projects} mode='teams' />
        </Stepper.Step>
        <Stepper.Step description='Setup Jira Permissions'>
          <JiraPermissionManager iosTag={iosTag} projectNames={projects} />
        </Stepper.Step>
        <Stepper.Step description='Create Bitbucket Projects'>
          <BitbucketProjectsCreationForm projectNames={projects} />
        </Stepper.Step>
        <Stepper.Step description='Setup Bitbucket Permissions'>
          <BitbucketPermissionsManager iosTag={iosTag} projectNames={projects} />
        </Stepper.Step>
        <Stepper.Step description='Create Bamboo Projects'>
          <BambooProjectCreationForm projectNames={projects} />
        </Stepper.Step>
        <Stepper.Step description='Create Confluence Spaces'>
          <ConfluenceSpaceCreationForm projectNames={projects} />
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
