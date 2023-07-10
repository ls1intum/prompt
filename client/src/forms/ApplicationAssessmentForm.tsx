import { useForm } from '@mantine/form'
import {
  type Student,
  type ApplicationAssessment,
} from '../redux/applicationsSlice/applicationsSlice'
import { Button, Checkbox, Divider, Group, Text, TextInput, Textarea } from '@mantine/core'
import { StudentApplicationComment } from './StudentApplicationComment'
import {
  createInstructorCommentForCoachApplication,
  createInstructorCommentForDeveloperApplication,
  createInstructorCommentForTutorApplication,
} from '../redux/applicationsSlice/thunks/createInstructorComment'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../redux/store'
import { useState } from 'react'
import { IconSend } from '@tabler/icons-react'
import { type Patch } from '../service/configService'
import {
  updateCoachApplicationAssessment,
  updateDeveloperApplicationAssessment,
  updateTutorApplicationAssessment,
} from '../redux/applicationsSlice/thunks/updateApplicationAssessment'
import { updateStudent } from '../redux/applicationsSlice/thunks/updateStudent'

interface ApplicationAssessmentFormProps {
  applicationId: string
  applicationType: 'developer' | 'coach' | 'tutor'
  student: Student
  assessment?: ApplicationAssessment
}

export const ApplicationAssessmentForm = ({
  applicationId,
  student,
  assessment,
  applicationType,
}: ApplicationAssessmentFormProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useAppSelector((state) => state.auth)
  const [comment, setComment] = useState('')
  const assessmentForm = useForm<ApplicationAssessment>({
    initialValues: {
      instructorComments: assessment?.instructorComments ?? [],
      assessmentScore: assessment?.assessmentScore ?? 0,
      technicalChallengeScore: assessment?.technicalChallengeScore ?? 0,
      accepted: assessment?.accepted ?? false,
      assessed: assessment?.accepted ?? false,
      interviewInviteSent: assessment?.interviewInviteSent ?? false,
    },
  })
  const studentFeedbackForm = useForm({
    initialValues: {
      suggestedAsCoach: student.suggestedAsCoach ?? false,
      suggestedAsTutor: student.suggestedAsTutor ?? false,
      blockedByPm: student.blockedByPm ?? false,
      reasonForBlockedByPm: student.reasonForBlockedByPm ?? '',
    },
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
      <Divider />
      <Group grow>
        <Checkbox
          mt='md'
          label='Suggested as Coach'
          {...studentFeedbackForm.getInputProps('suggestedAsCoach', {
            type: 'checkbox',
          })}
        />
        <Checkbox
          mt='md'
          label='Suggested as Tutor'
          {...studentFeedbackForm.getInputProps('suggestedAsTutor', {
            type: 'checkbox',
          })}
        />
        <Checkbox
          mt='md'
          label='Blocked by PM'
          {...studentFeedbackForm.getInputProps('blockedByPm', {
            type: 'checkbox',
          })}
        />
      </Group>
      {studentFeedbackForm.values.blockedByPm && (
        <Textarea
          autosize
          label='Reason for Blocked by PM'
          placeholder='Reason for blocked by PM'
          minRows={5}
          {...studentFeedbackForm.getInputProps('reasonForBlockedByPm')}
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
        {(applicationType === 'coach' || applicationType === 'tutor') && (
          <Checkbox
            mt='md'
            label='Selected for Interview'
            {...assessmentForm.getInputProps('interviewInviteSent', {
              type: 'checkbox',
            })}
          />
        )}
      </Group>
      <Group position='right'>
        <Button
          disabled={!assessmentForm.isDirty() && !studentFeedbackForm.isDirty()}
          onClick={() => {
            if (assessmentForm.isDirty()) {
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
            }

            if (studentFeedbackForm.isDirty()) {
              const studentPatchObjectArray: Patch[] = []
              Object.keys(studentFeedbackForm.values).forEach((key) => {
                if (studentFeedbackForm.isTouched(key)) {
                  const studentPatchObject = new Map()
                  studentPatchObject.set('op', 'replace')
                  studentPatchObject.set('path', '/' + key)
                  studentPatchObject.set('value', studentFeedbackForm.getInputProps(key).value)
                  const obj = Object.fromEntries(studentPatchObject)
                  studentPatchObjectArray.push(obj)
                }
              })

              void dispatch(
                updateStudent({
                  studentId: student.id,
                  studentPatch: studentPatchObjectArray,
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
      <Group position='left' style={{ alignItems: 'center' }}>
        <Textarea
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
  )
}
