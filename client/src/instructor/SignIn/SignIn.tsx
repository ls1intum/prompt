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
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../../redux/authenticationSlice/thunks/signIn'
import { type AppDispatch, useAppSelector } from '../../redux/store'

export const SignIn = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const signedInUser = useAppSelector((state) => state.authentication.user)
  const navigateTo = useNavigate()
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validateInputOnBlur: true,
  })

  useEffect(() => {
    if (signedInUser) {
      navigateTo('/management')
    }
  }, [signedInUser])

  return (
    <>
      <Container size={420} my={40}>
        <Title align='center'>Welcome back!</Title>
        <Text color='dimmed' size='sm' align='center' mt={5}>
          Do not have an account yet?{' '}
          <Anchor
            size='sm'
            component='button'
            onClick={() => {
              navigateTo('/management/signup')
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
                void dispatch(signIn(form.values))
              }
            }}
          >
            Sign in
          </Button>
        </Paper>
      </Container>
    </>
  )
}
