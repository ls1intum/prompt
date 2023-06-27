import { Card, Text, Title } from '@mantine/core'

export const ApplicationSuccessfulSubmission = (): JSX.Element => {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <Card withBorder p='xl'>
        <Title order={5}>Your application was successfully submitted!</Title>
        <Text c='dimmed'>
          Please prioritize the iPraktikum course as 1st priority in the Matching tool.
        </Text>
      </Card>
    </div>
  )
}
