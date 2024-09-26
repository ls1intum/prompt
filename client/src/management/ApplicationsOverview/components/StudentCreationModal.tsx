import { Box, Button, Group, Modal, Select, Text } from '@mantine/core'
import {
  ApplicationFormAccessMode,
  DefaultApplicationForm,
} from '../../../forms/DefaultApplicationForm'
import { ApplicationType } from '../../../interface/application'
import { useState } from 'react'
import { useCourseIterationStore } from '../../../state/zustand/useCourseIterationStore'
import { CourseIteration } from '../../../interface/courseIteration'
import { useDefaultApplicationForm } from '../../../forms/hooks/useDefaultApplicationForm'
import { postApplication } from '../../../network/application'

interface MatchingResultsUploadModalProps {
  opened: boolean
  onClose: () => void
}

export const StudentCreationModal = ({
  opened,
  onClose,
}: MatchingResultsUploadModalProps): JSX.Element => {
  const [applicationType, setApplicationType] = useState<ApplicationType | undefined>(undefined)
  const { selectedCourseIteration, courseIterations } = useCourseIterationStore()
  const [applicationSuccessfullySubmitted, setApplicationSuccessfullySubmitted] = useState(false)
  const [formSelectedCourseIteration, setFormSelectedCourseIteration] = useState<
    CourseIteration | undefined
  >(selectedCourseIteration)

  const defaultForm = useDefaultApplicationForm(
    undefined, // undefined initial values
    ApplicationFormAccessMode.INSTRUCTOR_MANUAL_ADDING, // required for form validation
  )

  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      size='80%'
      title={
        <Text c='dimmed' fz='sm'>
          Add a student
        </Text>
      }
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '95%',
          gap: '2vh',
        }}
        mx='auto'
      >
        <Select
          label='Course Iteration'
          value={formSelectedCourseIteration?.id.toString()}
          onChange={(changedCourseIterationId) => {
            const changedCourseIteration = courseIterations.find(
              (as) => as.id.toString() === changedCourseIterationId,
            )
            if (changedCourseIteration) {
              setFormSelectedCourseIteration(changedCourseIteration)
            }
          }}
          data={courseIterations.map((courseIteration) => {
            return {
              value: courseIteration.id.toString(),
              label: courseIteration.semesterName,
            }
          })}
        />

        <Select
          label='Application Type'
          value={applicationType}
          onChange={(value) => {
            console.log(value)
            setApplicationType(value as ApplicationType)
          }}
          data={Object.values(ApplicationType).map((type) => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
          }))}
        />

        <DefaultApplicationForm
          accessMode={ApplicationFormAccessMode.INSTRUCTOR_MANUAL_ADDING}
          form={defaultForm}
          title='Application for Agile Project Management Practical Course'
        />
        <Group align='right' mt='md'>
          <Button
            disabled={!defaultForm.isValid() || applicationType === undefined}
            type='submit'
            onClick={() => {
              if (
                defaultForm.isValid() &&
                applicationType !== undefined &&
                formSelectedCourseIteration !== undefined
              ) {
                postApplication(
                  applicationType,
                  defaultForm.values,
                  formSelectedCourseIteration.semesterName,
                )
                  .then((response) => {
                    if (response) {
                      setApplicationSuccessfullySubmitted(true)
                    }
                  })
                  .catch(() => {})
                onClose()
              }
            }}
          >
            Submit
          </Button>
        </Group>
      </Box>
    </Modal>
  )
}
