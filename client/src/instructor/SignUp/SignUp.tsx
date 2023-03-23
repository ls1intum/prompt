import {
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Select,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'
import { signUp } from '../../service/authService'

export const SignUp = (): JSX.Element => {
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
              void signUp({
                firstName: form.values.firstName,
                lastName: form.values.lastName,
                email: form.values.email,
                username: form.values.username,
                password: form.values.password,
                roles: [form.values.role],
              })
            }
          }}
        >
          Create account
        </Button>
      </Paper>
    </Container>
  )
}
