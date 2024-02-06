import { useForm } from '@mantine/form'
import { ApplicationAssessment, ApplicationType, Student } from '../interface/application'
import {
  Button,
  Checkbox,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
  Timeline,
  Tooltip,
} from '@mantine/core'
import { StudentApplicationComment } from './StudentApplicationComment'
import { useEffect, useMemo, useState } from 'react'
import {
  IconBan,
  IconCalendarEvent,
  IconCheck,
  IconChecklist,
  IconCircleCheck,
  IconQuestionMark,
  IconSend,
} from '@tabler/icons-react'
import { type Patch } from '../network/configService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  patchApplicationAssessment,
  postApplicationAcceptance,
  postApplicationRejection,
  postInstructorComment,
  postInterviewInvitation,
} from '../network/application'
import { Query } from '../state/query'
import { useAuthenticationStore } from '../state/zustand/useAuthenticationStore'

interface ConfirmationModalProps {
  title: string
  text: string
  opened: boolean
  onConfirm: () => void
  onClose: () => void
}

const ConfirmationModal = ({
  title,
  text,
  opened,
  onClose,
  onConfirm,
}: ConfirmationModalProps): JSX.Element => {
  return (
    <Modal opened={opened} onClose={onClose} centered title={title}>
      <Stack>
        <Text>{text}</Text>
        <Group>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

interface ApplicationAssessmentFormProps {
  applicationId: string
  applicationType: ApplicationType
  student: Student
  assessment?: ApplicationAssessment
}

export const ApplicationAssessmentForm = ({
  applicationId,
  student,
  assessment,
  applicationType,
}: ApplicationAssessmentFormProps): JSX.Element => {
  const queryClient = useQueryClient()
  const { user } = useAuthenticationStore()
  const [comment, setComment] = useState('')
  const [activeTimelineStatus, setActiveTimelineStatus] = useState(0)
  const [
    interviewInivitationEmailSendConfirmationModalOpened,
    setInterviewInvitationSendConfirmationModalOpened,
  ] = useState(false)
  const [
    applicationRejectionEmailSendConfirmationModalOpened,
    setApplicationRejectionSendConfirmationModalOpened,
  ] = useState(false)
  const [
    applicationAcceptanceEmailSendConfirmationModalOpened,
    setApplicationAcceptanceSendConfirmationModalOpened,
  ] = useState(false)
  const assessmentForm = useForm<ApplicationAssessment>({
    initialValues: {
      instructorComments: assessment?.instructorComments ?? [],
      assessmentScore: assessment?.assessmentScore ?? 0,
      technicalChallengeProgrammingScore: assessment?.technicalChallengeProgrammingScore ?? 0,
      technicalChallengeQuizScore: assessment?.technicalChallengeQuizScore ?? 0,
      status: assessment?.status ?? 'NOT_ASSESSED',
    },
  })
  const studentForm = useForm<Student>({
    initialValues: {
      ...student,
      suggestedAsCoach: student?.suggestedAsCoach ?? false,
      suggestedAsTutor: student?.suggestedAsTutor ?? false,
      blockedByPm: student?.blockedByPm ?? false,
      reasonForBlockedByPm: student?.reasonForBlockedByPm ?? '',
    },
  })

  const queryKey = useMemo(() => {
    if (applicationType === ApplicationType.DEVELOPER) {
      return [Query.DEVELOPER_APPLICATION]
    }
    if (applicationType === ApplicationType.COACH) {
      return [Query.COACH_APPLICATION]
    }
    if (applicationType === ApplicationType.TUTOR) {
      return [Query.TUTOR_APPLICATION]
    }
  }, [applicationType])

  const updateApplicationAssessment = useMutation({
    mutationFn: (assessmentPatch: Patch[]) => {
      return patchApplicationAssessment(applicationType, applicationId, assessmentPatch)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  const createInstructorComment = useMutation({
    mutationFn: (instructorComment: { author: string; text: string }) =>
      postInstructorComment(applicationType, applicationId, instructorComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  const sendInterviewInvitation = useMutation({
    mutationFn: () => postInterviewInvitation(applicationType, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  const sendAcceptance = useMutation({
    mutationFn: () => postApplicationAcceptance(applicationType, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  const sendRejection = useMutation({
    mutationFn: () => postApplicationRejection(applicationType, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  useEffect(() => {
    assessmentForm.setValues({
      instructorComments: assessment?.instructorComments ?? [],
      assessmentScore: assessment?.assessmentScore ?? 0,
      status: assessment?.status ?? 'NOT_ASSESSED',
    })
    assessmentForm.resetDirty()
    assessmentForm.resetTouched()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment])

  useEffect(() => {
    studentForm.setValues({
      ...student,
      suggestedAsCoach: student?.suggestedAsCoach ?? false,
      suggestedAsTutor: student?.suggestedAsTutor ?? false,
      blockedByPm: student?.blockedByPm ?? false,
      reasonForBlockedByPm: student?.reasonForBlockedByPm ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student])

  useEffect(() => {
    if (
      assessmentForm.values.status === 'ACCEPTED' ||
      assessmentForm.values.status === 'REJECTED'
    ) {
      setActiveTimelineStatus(3)
    } else if (assessmentForm.values.assessmentScore) {
      setActiveTimelineStatus(2)
    } else {
      setActiveTimelineStatus(1)
    }
  }, [assessment, assessmentForm.values.assessmentScore, assessmentForm.values.status])

  const updateAssessmentStatus = (status: string): void => {
    const assessmentPatchObjectArray: Patch[] = []
    const assessmentPatchObject = new Map()
    assessmentPatchObject.set('op', 'replace')
    assessmentPatchObject.set('path', '/status')
    assessmentPatchObject.set('value', status)
    const obj = Object.fromEntries(assessmentPatchObject)
    assessmentPatchObjectArray.push(obj)

    updateApplicationAssessment.mutate(assessmentPatchObjectArray)
  }

  return (
    <>
      <ConfirmationModal
        title='Confirm Interview Invitation'
        text='Are You sure You would like to send an interview invitation?'
        opened={interviewInivitationEmailSendConfirmationModalOpened}
        onClose={() => {
          setInterviewInvitationSendConfirmationModalOpened(false)
        }}
        onConfirm={() => {
          sendInterviewInvitation.mutate()
          setInterviewInvitationSendConfirmationModalOpened(false)
        }}
      />
      <ConfirmationModal
        title='Confirm Application Acceptance'
        text='Are You sure You would like to accept this application?'
        opened={applicationAcceptanceEmailSendConfirmationModalOpened}
        onClose={() => {
          setApplicationAcceptanceSendConfirmationModalOpened(false)
        }}
        onConfirm={() => {
          sendAcceptance.mutate()
          setApplicationAcceptanceSendConfirmationModalOpened(false)
        }}
      />
      <ConfirmationModal
        title='Confirm Application Rejection'
        text='Are You sure You would like to reject this application?'
        opened={applicationRejectionEmailSendConfirmationModalOpened}
        onClose={() => {
          setApplicationRejectionSendConfirmationModalOpened(false)
        }}
        onConfirm={() => {
          sendRejection.mutate()
          setApplicationRejectionSendConfirmationModalOpened(false)
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
        <Divider />
        <Timeline active={activeTimelineStatus} bulletSize={24} lineWidth={2}>
          <Timeline.Item
            title={
              <Text fz='sm' c='dimmed' fw={500}>
                Previous Assessments
              </Text>
            }
            bullet={<IconChecklist size={12} />}
          >
            <Group grow>
              <Checkbox
                mt='md'
                label='Suggested as Coach'
                {...studentForm.getInputProps('suggestedAsCoach', {
                  type: 'checkbox',
                })}
              />
              <Checkbox
                mt='md'
                label='Suggested as Tutor'
                {...studentForm.getInputProps('suggestedAsTutor', {
                  type: 'checkbox',
                })}
              />
              <Checkbox
                mt='md'
                label='Blocked by PM'
                {...studentForm.getInputProps('blockedByPm', {
                  type: 'checkbox',
                })}
              />
            </Group>
            {studentForm.values.blockedByPm && (
              <Textarea
                autosize
                label='Reason for Blocked by PM'
                placeholder='Reason for blocked by PM'
                minRows={5}
                {...studentForm.getInputProps('reasonForBlockedByPm')}
              />
            )}
          </Timeline.Item>
          <Timeline.Item
            bullet={
              assessmentForm.values.assessmentScore ? (
                <IconCheck size={12} />
              ) : (
                <IconQuestionMark size={12} />
              )
            }
            title={
              <Text fz='sm' c='dimmed' fw={500}>
                Current Assessment
              </Text>
            }
          >
            <Stack>
              <TextInput
                onWheel={(e) => {
                  e.currentTarget.blur()
                }}
                withAsterisk
                type='number'
                label='Assessment Score'
                placeholder='Assessment Score'
                {...assessmentForm.getInputProps('assessmentScore')}
              />
              <Group align='right'>
                <Button
                  disabled={!assessmentForm.isDirty() && !studentForm.isDirty()}
                  onClick={() => {
                    if (studentForm.isDirty()) {
                      const studentPatchObjectArray: Patch[] = []
                      Object.keys(studentForm.values).forEach((key) => {
                        if (studentForm.isDirty(key)) {
                          const studentPatchObject = new Map()
                          studentPatchObject.set('op', 'replace')
                          studentPatchObject.set('path', '/' + key)
                          studentPatchObject.set('value', studentForm.getInputProps(key).value)
                          const obj = Object.fromEntries(studentPatchObject)
                          studentPatchObjectArray.push(obj)
                        }
                      })

                      updateApplicationAssessment.mutate(studentPatchObjectArray)
                    }

                    if (assessmentForm.isDirty()) {
                      const assessmentPatchObjectArray: Patch[] = []
                      Object.keys(assessmentForm.values).forEach((key) => {
                        if (assessmentForm.isDirty(key)) {
                          const assessmentPatchObject = new Map()
                          assessmentPatchObject.set('op', 'replace')
                          assessmentPatchObject.set('path', '/' + key)
                          assessmentPatchObject.set(
                            'value',
                            assessmentForm.getInputProps(key).value,
                          )
                          const obj = Object.fromEntries(assessmentPatchObject)
                          assessmentPatchObjectArray.push(obj)
                        }
                      })

                      updateApplicationAssessment.mutate(assessmentPatchObjectArray)
                    }
                  }}
                >
                  Submit
                </Button>
              </Group>
            </Stack>
          </Timeline.Item>
          {(applicationType === 'coach' || applicationType === 'tutor') && (
            <Timeline.Item
              title={
                <Text fz='sm' c='dimmed' fw={500}>
                  Interview Invitation
                </Text>
              }
              bullet={<IconCalendarEvent size={12} />}
            >
              <Stack>
                <Tooltip
                  label={`Please keep in mind that the interview invitation might have already been sent out. Make sure to check the outbox. 
                    An interview invitation email will be immediately sent out to the student. You can review the interview details 
                    in the Course Iteration Management console.`}
                  color='blue'
                  withArrow
                  multiline
                >
                  <div>
                    <Button
                      disabled={
                        assessmentForm.values.status === 'PENDING_INTERVIEW' ||
                        assessmentForm.values.status === 'ENROLLED'
                      }
                      variant='outline'
                      onClick={() => {
                        setInterviewInvitationSendConfirmationModalOpened(true)
                      }}
                    >
                      Send Interview Invitation
                    </Button>
                  </div>
                </Tooltip>
              </Stack>
            </Timeline.Item>
          )}
          <Timeline.Item
            title={
              <Text fz='sm' c='dimmed' fw={500}>
                Assessment Resolution
              </Text>
            }
            bullet={
              assessmentForm.values.status === 'ACCEPTED' ? (
                <IconCircleCheck size={12} />
              ) : assessmentForm.values.status === 'REJECTED' ? (
                <IconBan size={12} />
              ) : (
                <IconQuestionMark size={12} />
              )
            }
          >
            <Group align='left'>
              <Button
                color='red'
                variant='outline'
                disabled={
                  assessmentForm.values.status === 'REJECTED' ||
                  assessmentForm.values.status === 'ENROLLED'
                }
                onClick={() => {
                  if (applicationType === 'coach' || applicationType === 'tutor') {
                    setApplicationRejectionSendConfirmationModalOpened(true)
                  } else {
                    updateAssessmentStatus('REJECTED')
                  }
                }}
              >
                Reject
              </Button>
              <Button
                color='green'
                disabled={
                  assessmentForm.values.status === 'ACCEPTED' ||
                  assessmentForm.values.status === 'ENROLLED'
                }
                onClick={() => {
                  if (applicationType === 'coach' || applicationType === 'tutor') {
                    setApplicationAcceptanceSendConfirmationModalOpened(true)
                  } else {
                    updateAssessmentStatus('ACCEPTED')
                  }
                }}
              >
                Accept
              </Button>
            </Group>
          </Timeline.Item>
        </Timeline>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <Text fz='sm' fw={500}>
            Additional Notes
          </Text>
          {assessmentForm.values.instructorComments.map((cmt, idx) => (
            <div key={`${cmt.id ?? idx} ${cmt.timestamp ?? ''}`}>
              <StudentApplicationComment instructorComment={cmt} />
            </div>
          ))}
        </div>
        <Group align='right' style={{ alignContent: 'center' }}>
          <Textarea
            style={{ width: '100%' }}
            placeholder='Comment'
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
            }}
          />
          <Button
            leftSection={<IconSend />}
            onClick={() => {
              if (comment && comment.length !== 0 && assessmentForm.values) {
                assessmentForm.setValues({
                  ...assessmentForm.values,
                  instructorComments: [
                    ...assessmentForm.values.instructorComments,
                    {
                      author: user ? `${user.firstName} ${user.lastName}` : '',
                      text: comment,
                    },
                  ],
                })
                setComment('')
                createInstructorComment.mutate({
                  author: user ? `${user.firstName} ${user.lastName}` : '',
                  text: comment,
                })
              }
            }}
          >
            Send
          </Button>
        </Group>
      </div>
    </>
  )
}
