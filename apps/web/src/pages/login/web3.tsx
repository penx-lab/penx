import { Suspense, useMemo } from 'react'
import { Box } from '@fower/react'
import { Wallet } from 'lucide-react'
import { NEXTAUTH_PROVIDERS } from '@penx/constants'
import { ClientOnly } from '~/components/ClientOnly'
import { LoginForm } from '~/components/LoginForm/LoginForm'
import { Logo } from '~/components/Logo'
import { SiweModal } from '~/components/SiweModal'
import { WalletConnectButton } from '~/components/WalletConnectButton'

export default function LoginPage() {
  const providers = useMemo(() => {
    if (!NEXTAUTH_PROVIDERS) return []
    return (NEXTAUTH_PROVIDERS || '').split(',')
  }, [])

  const showGoogle = providers.includes('GOOGLE')
  const showGitHub = providers.includes('GITHUB')

  const loginEntry = useMemo(() => {
    if (process.env.NEXT_PUBLIC_DEPLOY_MODE === 'SELF_HOSTED') {
      return <LoginForm />
    }

    return (
      <Box column gap4>
        {/* <SiweModal /> */}
        <ClientOnly>
          <WalletConnectButton
            size={56}
            rounded2XL
            colorScheme="white"
            toBetween
          >
            <Wallet />
            <Box column gap1>
              <Box textBase fontSemibold>
                Login with Wallet
              </Box>
              <Box gray800 textXS fontLight>
                For web3 users and builders
              </Box>
            </Box>
          </WalletConnectButton>
        </ClientOnly>
      </Box>
    )
  }, [])

  return (
    <Box column h-100vh>
      <Box mx-auto py8 toCenter>
        <Logo />
      </Box>
      <Box column flex-1 toCenter>
        <Box
          toCenter
          py10
          roundedXL
          mx-auto
          bgWhite
          column
          mt--200
          w={['100%', '100%', 480]}
        >
          <Box as="h1" fontBold>
            Welcome to PenX
          </Box>
          <Box as="p" textCenter mb6 leadingNormal px10 gray500>
            A structured note-taking app for personal use
          </Box>

          {loginEntry}
        </Box>
      </Box>
    </Box>
  )
}