import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signUp } from '../../redux/authenticationSlice/thunks/signUp'
import { type AppDispatch } from '../../redux/store'

export const SignUp = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const navigateTo = useNavigate()
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      role: '',
    },
    validateInputOnBlur: true,
  })

  return (
    <Container size={700} my={40}>
      <Title align='center'>Create a new account</Title>
      <Text color='dimmed' size='sm' align='center' mt={5}>
        Do have an account already?{' '}
        <Anchor
          size='sm'
          component='button'
          onClick={() => {
            navigateTo('/management/signin')
          }}
        >
          Sign In
        </Anchor>
      </Text>
      <Paper
        withBorder
        shadow='md'
        p={30}
        mt={40}
        radius='md'
        style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}
      >
        <Group grow>
          <TextInput
            label='First Name'
            placeholder='First name'
            required
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label='Last Name'
            placeholder='Last name'
            required
            {...form.getInputProps('lastName')}
          />
        </Group>
        <TextInput
          label='Email'
          placeholder='Your email'
          required
          {...form.getInputProps('email')}
        />
        <TextInput
          label='Username'
          placeholder='Your username'
          required
          {...form.getInputProps('username')}
        />
        <PasswordInput
          label='Password'
          placeholder='Your password'
          required
          {...form.getInputProps('password')}
        />
        <Select
          withAsterisk
          required
          label='Role'
          placeholder='Role'
          data={[
            { value: 'coach', label: 'Coach' },
            { value: 'pl', label: 'Project Lead' },
            { value: 'instructor', label: 'Instructor' },
          ]}
          {...form.getInputProps('role')}
        />
        <Button
          fullWidth
          mt='xl'
          type='submit'
          onClick={() => {
            if (form.isValid()) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              dispatch(
                signUp({
                  firstName: form.values.firstName,
                  lastName: form.values.lastName,
                  email: form.values.email,
                  username: form.values.username,
                  password: form.values.password,
                  roles: [form.values.role],
                }),
              )
              navigateTo('/management')
            }
          }}
        >
          Create account
        </Button>
      </Paper>
    </Container>
  )
}
