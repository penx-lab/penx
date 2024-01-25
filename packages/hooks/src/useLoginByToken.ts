import { toast } from 'uikit'
import { api } from '@penx/trpc-client'

export function useLoginByToken() {
  // const { setToken } = useToken()
  async function login(token: string) {
    console.log('token===:', token)

    if (!token) {
      toast.warning('Please input your personal token')
      throw new Error('')
    }

    try {
      const payload = await api.user.loginByPersonalToken.mutate(token)

      console.log('========payload:', payload)
    } catch (error) {
      toast.warning('Please input a valid token')
      throw new Error('')
    }

    // setToken(payload.token)
    // setUser(payload.user)
    // push('/editor')
  }
  return { login }
}