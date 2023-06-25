import { type DeveloperApplicationFormProps } from '../../forms/DeveloperApplicationForm'

interface ApplicationSubmissionPageProps {
  child: React.ReactElement<DeveloperApplicationFormProps>
}

export const ApplicationSubmissionPage = ({
  child,
}: ApplicationSubmissionPageProps): JSX.Element => {
  return (
    <>
      <div style={{ margin: '5vh 5vw' }}>{child}</div>
    </>
  )
}
