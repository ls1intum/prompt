import { Button, Group, Modal, Stepper } from '@mantine/core'
import { useState } from 'react'
import { JiraAddUsersToGroupForm } from './jira/JiraAddUsersToGroupForm'

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
      <Stepper active={activeSetupStep} onStepClick={setActiveSetupStep} breakpoint='lg'>
        <Stepper.Step description='Add Students to Jira Group'>
          <JiraAddUsersToGroupForm iosTag={iosTag} />
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
