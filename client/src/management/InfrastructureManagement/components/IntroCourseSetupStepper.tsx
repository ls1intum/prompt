import { Button, Card, FileInput, Group, Modal, Stack, Stepper, Text } from '@mantine/core'
import Papa from 'papaparse'
import { useState } from 'react'
import { JiraAddUsersToGroupForm } from './jira/JiraAddUsersToGroupForm'
import { BitbucketProjectsCreationForm } from './bitbucket/BitbucketProjectsCreationForm'
import { BitbucketStudentRepositoryCreationForm } from './bitbucket/BitbucketStudentRepositoryCreationForm'
import { IconUpload } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { BitbucketStudentRepositoryPermissionManager } from './bitbucket/BitbucketStudentRepositoryPermissionManager'

interface IntroCourseSetupStepperProps {
  opened: boolean
  onClose: () => void
  iosTag: string
}

export const IntroCourseSetupStepper = ({
  opened,
  onClose,
  iosTag,
}: IntroCourseSetupStepperProps): JSX.Element => {
  const [activeSetupStep, setActiveSetupStep] = useState(0)
  const [students, setStudents] = useState<string[]>([])
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
      <Stepper active={activeSetupStep} onStepClick={setActiveSetupStep}>
        <Stepper.Step description='Create Bitbucket Projects'>
          <Stack>
            <Text fz='sm' c='dimmed'>
              Following Bitbucket projects will be created. If the checkbox is enabled, the project
              will be created with a repository with the same name. You can type in additional
              project names in the multiselect form.
            </Text>
            <BitbucketProjectsCreationForm
              projectNames={[`${iosTag.toLowerCase()}-intro`]}
              defaultWithRepository={false}
            />
          </Stack>
        </Stepper.Step>
        <Stepper.Step description='Add Students to Jira Group'>
          <Stack>
            <Text fz='sm' c='dimmed'>
              Upload a .csv file with student usernames. The expected structure is examplified
              below. Additionally, you can type student usernames into the multiselect form. The
              selected users will be added to the groups selected at the bottom. The groups are
              loaded from the Jira server. However, you can type new group names to create into the
              multiselect form.
            </Text>
            <Card>
              <Text fz='sm' ta='right' c='dimmed'>
                students.csv
              </Text>
              <Text fz='sm' c='bold'>
                Username
              </Text>
              <Text fz='sm' c='dimmed'>
                username_1
              </Text>
              <Text fz='sm' c='dimmed'>
                username_2
              </Text>
            </Card>
            <FileInput
              label='Student usernames'
              placeholder='Upload .csv file with student usernames'
              accept='.csv'
              leftSection={<IconUpload />}
              onChange={(file) => {
                if (file) {
                  Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    delimiter: ',',
                    complete: function (results: {
                      data: Array<{ Username: string }>
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
                      const usernamesFromCsv: string[] = []

                      results.data.forEach((data) => {
                        usernamesFromCsv.push(data.Username)
                      })

                      setStudents(usernamesFromCsv)
                    },
                  })
                }
              }}
            />
            <JiraAddUsersToGroupForm iosTag={iosTag} students={students} />
          </Stack>
        </Stepper.Step>
        <Stepper.Step description='Create Student Bitbucket Repositories'>
          <Stack>
            <Text fz='sm' c='dimmed'>
              Following repositories will be created in the selected Bitbucket project. If no
              projects are preloaded from the Bitbucket server, make sure to create those in Step 1.
              The created repositories will have the names of the student usernames.
            </Text>
            <BitbucketStudentRepositoryCreationForm iosTag={iosTag} students={students} />
          </Stack>
        </Stepper.Step>
        <Stepper.Step description='Setup Student Repository Permissions'>
          <BitbucketStudentRepositoryPermissionManager iosTag={iosTag} students={students} />
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
