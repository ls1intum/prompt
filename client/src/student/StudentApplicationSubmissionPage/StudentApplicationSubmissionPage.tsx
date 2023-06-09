import { useState } from 'react'
import {
  StudentApplicationAccessMode,
  StudentApplicationForm,
} from '../../forms/StudentApplicationForm'
import { StudentApplicationSuccessfulSubmission } from './StudentApplicationSuccessfulSubmission'

export const StudentApplicationSubmissionPage = (): JSX.Element => {
  const [successfullySubmitted, setSuccessfullySubmitted] = useState(false)

  return (
    <>
      {successfullySubmitted ? (
        <StudentApplicationSuccessfulSubmission />
      ) : (
        <div style={{ margin: '5vh 5vw' }}>
          <StudentApplicationForm
            accessMode={StudentApplicationAccessMode.STUDENT}
            onSuccessfulSubmit={() => {
              setSuccessfullySubmitted(true)
            }}
          />
        </div>
      )}
    </>
  )
}
