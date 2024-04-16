import { useListState } from '@mantine/hooks'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  type ClassAttributes,
  type HTMLAttributes,
  type LegacyRef,
  type ReactElement,
  type JSXElementConstructor,
  type ReactFragment,
  type ReactPortal,
  useEffect,
  useState,
} from 'react'
import {
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Divider,
  Group,
  Select,
  Spoiler,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { KickOffCourseAgreement } from '../../forms/KickOffCourseAgreement'
import { useProjectTeamStore } from '../../state/zustand/useProjectTeamStore'
import { useQuery } from '@tanstack/react-query'
import { getProjectTeams } from '../../network/projectTeam'
import { Query } from '../../state/query'
import { useSkillStore } from '../../state/zustand/useSkillStore'
import { getSkills } from '../../network/skill'
import { Skill } from '../../interface/skill'
import { CourseIteration } from '../../interface/courseIteration'
import { getCourseIterationsWithOpenKickOffPeriod } from '../../network/courseIteration'
import { ProjectTeam } from '../../interface/projectTeam'
import {
  SkillAssessmentSource,
  SkillProficiency,
  StudentPostKickoffSubmission,
} from '../../interface/postKickOffSubmission'
import { postPostKickoffSubmission } from '../../network/postKickOffSubmission'
import { DevelopmentProfile } from '../../interface/application'
import { getDevelopmentProfile } from '../../network/student'
import { useAuthenticationStore } from '../../state/zustand/useAuthenticationStore'

const shuffleProjectTeams = (array: ProjectTeam[]): ProjectTeam[] => {
  const shuffledArray = [...array]
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }
  return shuffledArray
}

interface SuccessfulSubmissionProps {
  title: string
  text: string
}

const SuccessfulSubmission = ({ title, text }: SuccessfulSubmissionProps): JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card withBorder p='xl'>
        <Title order={5}>{title}</Title>
        <Text c='dimmed'>{text}</Text>
      </Card>
    </div>
  )
}

export const PostKickoffSubmission = (): JSX.Element => {
  const { user } = useAuthenticationStore()
  const { projectTeams, setProjectTeams } = useProjectTeamStore()
  const { skills, setSkills } = useSkillStore()
  const [leftSideState, leftSideStateHandlers] = useListState<ProjectTeam>([])
  const [rightSideState, rightSideStateHandlers] = useListState<ProjectTeam>([])
  const postKickOffSubmissionForm = useForm<StudentPostKickoffSubmission>({
    initialValues: {
      selfReportedExperienceLevel: SkillProficiency.NOVICE,
      studentProjectTeamPreferences: [],
      reasonForFirstChoice: '',
      reasonForLastChoice: '',
      studentSkills: [],
    },
    validate: {
      selfReportedExperienceLevel: isNotEmpty('Please state your experience level.'),
      reasonForFirstChoice: isNotEmpty('Please state the reason behind your first choice.'),
      reasonForLastChoice: isNotEmpty('Please state the reason behind your last choice.'),
    },
    validateInputOnBlur: true,
  })
  const developmentProfileForm = useForm<DevelopmentProfile>({
    initialValues: {
      id: '',
      appleId: '',
      macBookDeviceId: '',
      iPhoneDeviceId: '',
      iPadDeviceId: '',
      appleWatchDeviceId: '',
      gitlabUsername: '',
    },
    validate: {
      appleId: isNotEmpty('Please provide a valid Apple ID.'),
      gitlabUsername: isNotEmpty('Please provide a GitLab username.'),
    },
    validateInputOnBlur: true,
  })
  const consentForm = useForm({
    initialValues: {
      courseAgreement: false,
    },
    validateInputOnChange: true,
    validate: {
      courseAgreement: (value) => !value,
    },
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const { data: courseIteration } = useQuery<CourseIteration | undefined>({
    queryKey: [Query.COURSE_ITERATION],
    queryFn: () => getCourseIterationsWithOpenKickOffPeriod(),
  })

  const { data: fetchedProjectTeams } = useQuery<ProjectTeam[]>({
    queryKey: [Query.PROJECT_TEAM, courseIteration?.semesterName],
    queryFn: () => getProjectTeams(courseIteration?.semesterName ?? ''),
    enabled: !!courseIteration,
  })

  const { data: fetchedSkills } = useQuery<Skill[]>({
    queryKey: [Query.SKILL],
    queryFn: () => getSkills(courseIteration?.id ?? ''),
    enabled: !!courseIteration,
  })

  useEffect(() => {
    ;(async () => {
      if (user) {
        const developmentProfile = await getDevelopmentProfile()
        if (developmentProfile) {
          developmentProfileForm.setValues(developmentProfile)
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (fetchedProjectTeams) {
      setProjectTeams(fetchedProjectTeams)
    }
  }, [fetchedProjectTeams, setProjectTeams])

  useEffect(() => {
    setSkills(fetchedSkills ?? [])
  }, [fetchedSkills, setSkills])

  useEffect(() => {
    postKickOffSubmissionForm.setValues({
      ...postKickOffSubmissionForm.values,
      studentSkills: skills.map((skill) => {
        return {
          skill,
          skillAssessmentSource: SkillAssessmentSource.STUDENT,
          skillProficiency: SkillProficiency.NOVICE,
        }
      }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills])

  useEffect(() => {
    rightSideStateHandlers.setState(shuffleProjectTeams(projectTeams))
    leftSideStateHandlers.setState([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectTeams])

  return (
    <div style={{ margin: '5vh' }}>
      {formSubmitted && (
        <SuccessfulSubmission
          title='Your priorities have been successfully submitted.'
          text='You will receive an email from your project lead as soon as you have been allocated to a team.'
        />
      )}
      {!formSubmitted && (
        <>
          <Center style={{ display: 'flex', flexDirection: 'column', gap: '3vh' }}>
            <Title order={2}>Kickoff Submission Form</Title>
          </Center>
          <Container size='70vw' style={{ padding: '3vh' }}>
            <Stack style={{ paddingBottom: '5vh' }}>
              <TextInput
                label='Apple ID'
                placeholder='Apple ID'
                required
                withAsterisk
                {...developmentProfileForm.getInputProps('appleId')}
              />
              <TextInput
                label='GitLab Username'
                placeholder='GitLab Username'
                required
                withAsterisk
                {...developmentProfileForm.getInputProps('gitlabUsername')}
              />
              <Group grow>
                <TextInput
                  label='MacBook Device ID'
                  placeholder='MacBook Device ID'
                  {...developmentProfileForm.getInputProps('macBookDeviceId')}
                />
                <TextInput
                  label='iPhone Device ID'
                  placeholder='iPhone Device ID'
                  {...developmentProfileForm.getInputProps('iPhoneDeviceId')}
                />
              </Group>
              <Group grow>
                <TextInput
                  label='iPad Device ID'
                  placeholder='iPad Device ID'
                  {...developmentProfileForm.getInputProps('iPadDeviceId')}
                />
                <TextInput
                  label='Apple Watch Device ID'
                  placeholder='Apple Watch Device ID'
                  {...developmentProfileForm.getInputProps('appleWatchDeviceId')}
                />
              </Group>
              <TextInput
                label='GitLab Username'
                placeholder='GitLab username'
                required
                withAsterisk
                {...postKickOffSubmissionForm.getInputProps('gitlabUsername')}
              />
              <Select
                withAsterisk
                required
                searchable
                label='Experience level'
                placeholder='How experience are you with SwiftUI?'
                data={Object.keys(SkillProficiency).map((key) => {
                  return {
                    label: SkillProficiency[key as keyof typeof SkillProficiency],
                    value: key,
                  }
                })}
                {...postKickOffSubmissionForm.getInputProps('selfReportedExperienceLevel')}
              />
              {skills.map((skill, idx) => (
                <Select
                  key={skill.id}
                  withAsterisk
                  required
                  label={skill.title}
                  placeholder={skill.description}
                  data={Object.keys(SkillProficiency).map((key) => {
                    return {
                      label: SkillProficiency[key as keyof typeof SkillProficiency],
                      value: key,
                    }
                  })}
                  {...postKickOffSubmissionForm.getInputProps(
                    'studentSkills.' + idx.toString() + '.skillProficiency',
                  )}
                />
              ))}
              <Divider
                label={
                  <Text c='dimmed' fz='sm' fw={500}>
                    Team Allocation Preferences
                  </Text>
                }
                labelPosition='center'
              />
              <Text c='dimmed' ta='center' fz='sm'>
                Please order the projects according to your preferences by dragging the boxes from
                right to left. A lower position number corresponding to a higher priority (1 =
                highest priority). Make sure to order all projects, i.e. the right side should be
                empy and the left side filled with all projects.
              </Text>
              <DragDropContext
                style={{ width: '100%', height: '50vh' }}
                onDragEnd={({ destination, source }: any) => {
                  if (!destination) {
                    return
                  }

                  const sourceList = source.droppableId
                  const destinationList = destination.droppableId

                  if (sourceList === destinationList) {
                    // Reorder within the same list
                    const items = [...(sourceList === 'left-side' ? leftSideState : rightSideState)]
                    const [removedItem] = items.splice(source.index, 1)
                    items.splice(destination.index, 0, removedItem)

                    if (sourceList === 'left-side') {
                      leftSideStateHandlers.setState(items)
                    } else {
                      rightSideStateHandlers.setState(items)
                    }
                  } else {
                    // Move item from one list to another
                    const sourceItems = [
                      ...(sourceList === 'left-side' ? leftSideState : rightSideState),
                    ]
                    const destinationItems = [
                      ...(destinationList === 'left-side' ? leftSideState : rightSideState),
                    ]

                    const [draggedItem] = sourceItems.splice(source.index, 1)
                    destinationItems.splice(destination.index, 0, draggedItem)

                    leftSideStateHandlers.setState(
                      sourceList === 'left-side' ? sourceItems : destinationItems,
                    )
                    rightSideStateHandlers.setState(
                      destinationList === 'left-side' ? sourceItems : destinationItems,
                    )
                  }
                }}
              >
                <Group grow style={{ alignItems: 'flex-start' }}>
                  <Droppable droppableId='left-side' direction='vertical'>
                    {(provided: {
                      droppableProps: JSX.IntrinsicAttributes &
                        ClassAttributes<HTMLDivElement> &
                        HTMLAttributes<HTMLDivElement>
                      innerRef: LegacyRef<HTMLDivElement> | undefined
                      placeholder:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | ReactFragment
                        | ReactPortal
                        | null
                        | undefined
                    }) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          width: '100%',
                          minHeight: '50vh',
                          border: '1px solid #373A40',
                          padding: '3vw 3vh',
                        }}
                      >
                        <Stack>
                          {leftSideState.map((projectTeam, index) => (
                            <Draggable
                              key={projectTeam.id}
                              draggableId={projectTeam.id}
                              index={index}
                            >
                              {(prov: any) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                >
                                  <Card withBorder>
                                    <Group>
                                      <Text>{index + 1}</Text>
                                      <Text color='dimmed' size='sm'>
                                        {projectTeam.customer}
                                      </Text>
                                    </Group>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Stack>
                      </div>
                    )}
                  </Droppable>
                  <Droppable droppableId='right-side' direction='vertical'>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          width: '100%',
                          minHeight: '50vh',
                          border: '1px solid #373A40',
                          padding: '3vw 3vh',
                        }}
                      >
                        <Stack>
                          {rightSideState.map((projectTeam, index) => (
                            <Draggable
                              key={projectTeam.id}
                              draggableId={projectTeam.id}
                              index={index}
                            >
                              {(prov: any) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                >
                                  <Card withBorder>
                                    <Text color='dimmed' size='sm'>
                                      {projectTeam.customer}
                                    </Text>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Stack>
                      </div>
                    )}
                  </Droppable>
                </Group>
              </DragDropContext>
            </Stack>
            <Stack>
              <Textarea
                autosize
                minRows={5}
                withAsterisk
                label='Reason for the First Choice'
                placeholder='Reason for high priority'
                required
                {...postKickOffSubmissionForm.getInputProps('reasonForFirstChoice')}
              />
              <Textarea
                autosize
                minRows={5}
                withAsterisk
                label='Reason for the Last Choice'
                placeholder='Reason for low priority'
                required
                {...postKickOffSubmissionForm.getInputProps('reasonForLastChoice')}
              />
            </Stack>
            <Checkbox
              mt='md'
              label='I have read the course agreement below and agree to it'
              {...consentForm.getInputProps('courseAgreement', {
                type: 'checkbox',
              })}
            />
            <Spoiler
              maxHeight={0}
              showLabel={<Text fz='sm'>Show Course Agreement</Text>}
              hideLabel={<Text fz='sm'>Hide</Text>}
            >
              <KickOffCourseAgreement />
            </Spoiler>
          </Container>
          <Group align='right'>
            <Button
              variant='filled'
              disabled={
                !courseIteration ||
                !postKickOffSubmissionForm.isValid() ||
                !consentForm.isValid() ||
                leftSideState.length !== projectTeams.length
              }
              onClick={() => {
                void (async () => {
                  const preferencesMap = new Map()
                  leftSideState.forEach((preference, index) => {
                    preferencesMap.set(preference.id, index)
                  })

                  if (courseIteration) {
                    const response = await postPostKickoffSubmission({
                      ...postKickOffSubmissionForm.values,
                      studentProjectTeamPreferences: leftSideState.map(
                        (projectTeam, priorityScore) => {
                          return {
                            projectTeamId: projectTeam.id,
                            priorityScore,
                          }
                        },
                      ),
                    })
                    if (response) {
                      setFormSubmitted(true)
                    }
                  }
                })()
              }}
            >
              Submit
            </Button>
          </Group>
        </>
      )}
    </div>
  )
}
