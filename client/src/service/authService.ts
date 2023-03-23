import axios from 'axios'

interface SignInRequest {
  username: string
  password: string
}

interface SignInResponse {
  id: string
  username: string
  email: string
  roles: string[]
  accessToken: string
}

interface SignUpRequest {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  roles: string[]
}

interface SignUpResponse {
  message: string
}

const signIn = async (signInRequest: SignInRequest): Promise<SignInResponse | undefined> => {
  try {
    return (await axios.post('http://localhost:8080/api/auth/signin', signInRequest)).data
  } catch (err) {
    console.log(err)
    return undefined
  }
}

const signUp = async (signUpRequest: SignUpRequest): Promise<SignUpResponse | undefined> => {
  try {
    return (await axios.post('http://localhost:8080/api/auth/signup', signUpRequest)).data
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export { signIn, signUp }
