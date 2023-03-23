import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'
import { signIn } from '../../service/authService'
import { SignUp } from '../SignUp/SignUp'

export const SignIn = (): JSX.Element => {
  const [signUp, setSignUp] = useState(false)
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validateInputOnBlur: true,
  })

  const submit = async (): Promise<void> => {
    const response = await signIn(form.values)
    if (response) {
      localStorage.setItem('jwt_token', response.accessToken)
      localStorage.setItem('user_id', response.id)
    }
  }

  return (
    <>
      {!signUp ? (
        <Container size={420} my={40}>
          <Title align='center'>Welcome back!</Title>
          <Text color='dimmed' size='sm' align='center' mt={5}>
            Do not have an account yet?{' '}
            <Anchor
              size='sm'
              component='button'
              onClick={() => {
                setSignUp(true)
              }}
            >
              Create account
            </Anchor>
          </Text>

          <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
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
              mt='md'
              {...form.getInputProps('password')}
            />
            <Group position='apart' mt='lg'>
              <Checkbox label='Remember me' />
              <Anchor component='button' size='sm'>
                Forgot password?
              </Anchor>
            </Group>
            <Button
              fullWidth
              mt='xl'
              type='submit'
              onClick={() => {
                if (form.isValid()) {
                  void submit()
                }
              }}
            >
              Sign in
            </Button>
          </Paper>
        </Container>
      ) : (
        <SignUp />
      )}
    </>
  )
}
