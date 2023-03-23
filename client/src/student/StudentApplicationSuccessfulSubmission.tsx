import { Center, Paper, Text, Title } from '@mantine/core'

export const StudentApplicationSuccessfulSubmission = (): JSX.Element => {
  return (
    <Center>
      <Paper withBorder p='xl'>
        <Title order={3}>Your application was successfully submitted!</Title>
        <Text>Please prioritize the iPraktikum course as 1st priority in the Matching tool.</Text>
      </Paper>
    </Center>
  )
}
