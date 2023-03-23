import { useState } from 'react'
import {
  StudentApplicationAccessMode,
  StudentApplicationForm,
} from '../forms/StudentApplicationForm'
import { StudentApplicationSuccessfulSubmission } from './StudentApplicationSuccessfulSubmission'

export const StudentApplicationSubmissionPage = (): JSX.Element => {
  const [successfullySubmitted, setSuccessfullySubmitted] = useState(false)

  return (
    <>
      {successfullySubmitted ? (
        <StudentApplicationSuccessfulSubmission />
      ) : (
        <StudentApplicationForm
          accessMode={StudentApplicationAccessMode.STUDENT}
          onSuccessfulSubmit={() => {
            setSuccessfullySubmitted(true)
          }}
        />
      )}
    </>
  )
}
