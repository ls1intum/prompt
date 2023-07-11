import { useForm } from '@mantine/form'
import { type ApplicationAssessment } from '../redux/applicationsSlice/applicationsSlice'
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
  Tooltip,
} from '@mantine/core'
import { StudentApplicationComment } from './StudentApplicationComment'
import {
  createInstructorCommentForCoachApplication,
  createInstructorCommentForDeveloperApplication,
  createInstructorCommentForTutorApplication,
} from '../redux/applicationsSlice/thunks/createInstructorComment'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../redux/store'
import { useEffect, useState } from 'react'
import { IconSend } from '@tabler/icons-react'
import { type Patch } from '../service/configService'
import {
  updateCoachApplicationAssessment,
  updateDeveloperApplicationAssessment,
  updateTutorApplicationAssessment,
} from '../redux/applicationsSlice/thunks/updateApplicationAssessment'
import {
  sendCoachInterviewInvitation,
  sendTutorInterviewInvitation,
} from '../redux/applicationsSlice/thunks/sendInterviewInvitation'
import {
  sendCoachApplicationRejection,
  sendTutorApplicationRejection,
} from '../redux/applicationsSlice/thunks/sendApplicationRejection'

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
  applicationType: 'developer' | 'coach' | 'tutor'
  assessment?: ApplicationAssessment
}

export const ApplicationAssessmentForm = ({
  applicationId,
  assessment,
  applicationType,
}: ApplicationAssessmentFormProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useAppSelector((state) => state.auth)
  const [comment, setComment] = useState('')
  const [
    interviewInivitationEmailSendConfirmationModalOpened,
    setInterviewInvitationSendConfirmationModalOpened,
  ] = useState(false)
  const [
    applicationRejectionEmailSendConfirmationModalOpened,
    setApplicationRejectionSendConfirmationModalOpened,
  ] = useState(false)
  const assessmentForm = useForm<ApplicationAssessment>({
    initialValues: {
      instructorComments: assessment?.instructorComments ?? [],
      suggestedAsCoach: assessment?.suggestedAsCoach ?? false,
      suggestedAsTutor: assessment?.suggestedAsTutor ?? false,
      blockedByPM: assessment?.blockedByPM ?? false,
      reasonForBlockedByPM: assessment?.reasonForBlockedByPM ?? '',
      assessmentScore: assessment?.assessmentScore ?? 0,
      accepted: assessment?.accepted ?? false,
      assessed: assessment?.assessed ?? false,
      interviewInviteSent: assessment?.interviewInviteSent ?? false,
    },
  })

  useEffect(() => {
    assessmentForm.setValues({
      instructorComments: assessment?.instructorComments ?? [],
      suggestedAsCoach: assessment?.suggestedAsCoach ?? false,
      suggestedAsTutor: assessment?.suggestedAsTutor ?? false,
      blockedByPM: assessment?.blockedByPM ?? false,
      reasonForBlockedByPM: assessment?.reasonForBlockedByPM ?? '',
      assessmentScore: assessment?.assessmentScore ?? 0,
      accepted: assessment?.accepted ?? false,
      assessed: assessment?.assessed ?? false,
      interviewInviteSent: assessment?.interviewInviteSent ?? false,
    })
    assessmentForm.resetDirty()
    assessmentForm.resetTouched()
  }, [assessment])

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
          if (applicationType === 'coach') {
            void dispatch(sendCoachInterviewInvitation(applicationId))
          } else if (applicationType === 'tutor') {
            void dispatch(sendTutorInterviewInvitation(applicationId))
          }
          setInterviewInvitationSendConfirmationModalOpened(false)
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
          if (applicationType === 'coach') {
            void dispatch(sendCoachApplicationRejection(applicationId))
          } else if (applicationType === 'tutor') {
            void dispatch(sendTutorApplicationRejection(applicationId))
          }
          setApplicationRejectionSendConfirmationModalOpened(false)
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
        <Divider />
        <Group grow>
          <Checkbox
            mt='md'
            label='Suggested as Coach'
            {...assessmentForm.getInputProps('suggestedAsCoach', {
              type: 'checkbox',
            })}
          />
          <Checkbox
            mt='md'
            label='Suggested as Tutor'
            {...assessmentForm.getInputProps('suggestedAsTutor', {
              type: 'checkbox',
            })}
          />
          <Checkbox
            mt='md'
            label='Blocked by PM'
            {...assessmentForm.getInputProps('blockedByPM', {
              type: 'checkbox',
            })}
          />
        </Group>
        {assessmentForm.values.blockedByPM && (
          <Textarea
            autosize
            label='Reason for Blocked by PM'
            placeholder='Reason for blocked by PM'
            minRows={5}
            {...assessmentForm.getInputProps('reasonForBlockedByPM')}
          />
        )}
        <TextInput
          withAsterisk
          type='number'
          label='Assessment Score'
          placeholder='Assessment Score'
          {...assessmentForm.getInputProps('assessmentScore')}
        />
        <Group grow style={{ alignItems: 'center' }}>
          <Checkbox
            mt='md'
            label='Accepted for the Course'
            {...assessmentForm.getInputProps('accepted', {
              type: 'checkbox',
            })}
          />
          <Checkbox
            mt='md'
            label='Application Assessed'
            {...assessmentForm.getInputProps('assessed', {
              type: 'checkbox',
            })}
          />
        </Group>
        <Group position='right'>
          {(applicationType === 'coach' || applicationType === 'tutor') && (
            <Group>
              <Button
                variant='outline'
                color='red'
                disabled={assessment?.accepted}
                onClick={() => {
                  setApplicationRejectionSendConfirmationModalOpened(true)
                }}
              >
                Reject Application
              </Button>
              <Tooltip
                label={
                  assessment?.interviewInviteSent
                    ? 'The interview invitation email has already been sent successfully.'
                    : 'An interview invitation email will be sent out to the student. You can review the interview details in the Course Iteration Management console.'
                }
                color='blue'
                withArrow
                multiline
              >
                <div>
                  <Button
                    variant='outline'
                    disabled={assessment?.interviewInviteSent}
                    onClick={() => {
                      setInterviewInvitationSendConfirmationModalOpened(true)
                    }}
                  >
                    Send Interview Invitation
                  </Button>
                </div>
              </Tooltip>
            </Group>
          )}
          <Button
            disabled={!assessmentForm.isDirty()}
            onClick={() => {
              const assessmentPatchObjectArray: Patch[] = []
              Object.keys(assessmentForm.values).forEach((key) => {
                if (assessmentForm.isTouched(key)) {
                  const assessmentPatchObject = new Map()
                  assessmentPatchObject.set('op', 'replace')
                  assessmentPatchObject.set('path', '/' + key)
                  assessmentPatchObject.set('value', assessmentForm.getInputProps(key).value)
                  const obj = Object.fromEntries(assessmentPatchObject)
                  assessmentPatchObjectArray.push(obj)
                }
              })

              if (applicationType === 'developer') {
                void dispatch(
                  updateDeveloperApplicationAssessment({
                    applicationId,
                    applicationAssessmentPatch: assessmentPatchObjectArray,
                  }),
                )
              } else if (applicationType === 'coach') {
                void dispatch(
                  updateCoachApplicationAssessment({
                    applicationId,
                    applicationAssessmentPatch: assessmentPatchObjectArray,
                  }),
                )
              } else if (applicationType === 'tutor') {
                void dispatch(
                  updateTutorApplicationAssessment({
                    applicationId,
                    applicationAssessmentPatch: assessmentPatchObjectArray,
                  }),
                )
              }
            }}
          >
            Submit
          </Button>
        </Group>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <Text fz='sm' weight={500}>
            Additional Notes
          </Text>
          {assessmentForm.values.instructorComments.map((comment, idx) => (
            <div key={`${comment.id ?? idx} ${comment.timestamp ?? ''}`}>
              <StudentApplicationComment instructorComment={comment} />
            </div>
          ))}
        </div>
        <Group position='right' style={{ alignContent: 'center' }}>
          <Textarea
            style={{ width: '100%' }}
            placeholder='Comment'
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
            }}
          />
          <Button
            leftIcon={<IconSend />}
            onClick={() => {
              if (comment && comment.length !== 0 && assessmentForm.values) {
                assessmentForm.setValues({
                  ...assessmentForm.values,
                  instructorComments: [
                    ...assessmentForm.values.instructorComments,
                    {
                      author: auth ? `${auth.firstName} ${auth.lastName}` : '',
                      text: comment,
                    },
                  ],
                })
                setComment('')
                if (applicationType === 'developer') {
                  void dispatch(
                    createInstructorCommentForDeveloperApplication({
                      applicationId,
                      instructorComment: {
                        author: auth ? `${auth.firstName} ${auth.lastName}` : '',
                        text: comment,
                      },
                    }),
                  )
                } else if (applicationType === 'coach') {
                  void dispatch(
                    createInstructorCommentForCoachApplication({
                      applicationId,
                      instructorComment: {
                        author: auth ? `${auth.firstName} ${auth.lastName}` : '',
                        text: comment,
                      },
                    }),
                  )
                } else if (applicationType === 'tutor') {
                  void dispatch(
                    createInstructorCommentForTutorApplication({
                      applicationId,
                      instructorComment: {
                        author: auth ? `${auth.firstName} ${auth.lastName}` : '',
                        text: comment,
                      },
                    }),
                  )
                }
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
