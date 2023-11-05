import {
  Button,
  Card,
  Checkbox,
  FileInput,
  Group,
  Modal,
  Stack,
  Stepper,
  Text,
} from '@mantine/core'
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
import { MultiSelectCreatable, MultiSelectItem } from '../../../utilities/CustomMultiSelect'

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

  const [projects, setProjects] = useState<MultiSelectItem[]>([])
  const [prependProjectNamesWithIosTag, setPrependProjectNamesWithIosTag] = useState(false)

  return (
    <Modal centered size='100%' opened={opened} onClose={onClose}>
      <Stepper active={activeSetupStep} onStepClick={setActiveSetupStep}>
        <Stepper.Step description='Upload Projects File'>
          <Stack>
            <Text fz='sm' c='dimmed'>
              Upload a .csv file with projects you would like to create. The .csv file should
              resemble the structure exemplified below. Otherwise, enter the project names into the
              multiselect form. Checking the box will automatically prepend the iOS tag to the
              project names.
            </Text>
            <Card>
              <Text fz='sm' ta='right' c='dimmed'>
                projects.csv
              </Text>
              <Text fz='sm' c='bold'>
                Name
              </Text>
              <Text fz='sm' c='dimmed'>
                project_1
              </Text>
              <Text fz='sm' c='dimmed'>
                project_2
              </Text>
            </Card>
            <Checkbox
              label='Prepend Project Names with iOS Tag'
              checked={prependProjectNamesWithIosTag}
              onChange={(e) => {
                setPrependProjectNamesWithIosTag(e.target.checked)
              }}
            />
            <FileInput
              label='Projects'
              placeholder='Upload .csv file with projects'
              accept='.csv'
              leftSection={<IconUpload />}
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
                        projectsFromCsv.push(
                          `${prependProjectNamesWithIosTag ? iosTag.toUpperCase() : ''}${
                            data.Name
                          }`,
                        )
                      })

                      setProjects(projectsFromCsv.map((p) => ({ label: p, value: p })))
                    },
                  })
                }
              }}
            />
            <MultiSelectCreatable
              label='Projects'
              data={projects}
              onCreate={(query) => {
                const newProjectName = `${
                  prependProjectNamesWithIosTag ? iosTag.toUpperCase() : ''
                }${query}`
                setProjects((current) => [
                  ...current,
                  { label: newProjectName, value: newProjectName },
                ])
                return newProjectName
              }}
              value={projects}
              onChange={setProjects}
            />
          </Stack>
        </Stepper.Step>
        <Stepper.Step description='Create Jira Project Categories'>
          <Text fz='sm' c='dimmed'>
            Select project categories from the suggested list generated from the project names or
            enter a new project category to create.
          </Text>
          <JiraProjectCategoriesCreationForm
            mode='teams'
            initialProjectCategoriesToCreate={projects.map((p) => p.value)}
          />
        </Stepper.Step>
        <Stepper.Step description='Create Jira Projects'>
          <JiraProjectsCreationForm
            iosTag={iosTag}
            mode='teams'
            initialProjectsToCreate={projects.map((p) => {
              return {
                name: p.value,
                key: p.value,
                lead: '',
              }
            })}
          />
        </Stepper.Step>
        <Stepper.Step description='Create Jira User Groups'>
          <JiraGroupsCreationForm
            iosTag={iosTag}
            projectNames={projects.map((p) => p.value)}
            mode='teams'
          />
        </Stepper.Step>
        <Stepper.Step description='Setup Jira Permissions'>
          <JiraPermissionManager iosTag={iosTag} projectNames={projects.map((p) => p.value)} />
        </Stepper.Step>
        <Stepper.Step description='Create Bitbucket Projects'>
          <BitbucketProjectsCreationForm projectNames={projects.map((p) => p.value)} />
        </Stepper.Step>
        <Stepper.Step description='Setup Bitbucket Permissions'>
          <BitbucketPermissionsManager
            iosTag={iosTag}
            projectNames={projects.map((p) => p.value)}
          />
        </Stepper.Step>
        <Stepper.Step description='Create Bamboo Projects'>
          <BambooProjectCreationForm projectNames={projects.map((p) => p.value)} />
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
