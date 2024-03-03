import { Fragment, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Session } from 'next-auth'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import 'next-auth/react'
import { fowerStore, Parser } from '@fower/react'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'uikit'
import { isServer } from '@penx/constants'
import { api } from '~/utils/api'
import { initFower } from '../common/initFower'
// import { SpeedInsights } from '@vercel/speed-insights/next'
// import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism-twilight.css'

import 'simplebar-react/dist/simplebar.min.css'
import 'react-circular-progressbar/dist/styles.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/globals.css'
import '../styles/command.scss'
import '@glideapps/glide-data-grid/dist/index.css'
import { TrpcProvider } from '@penx/trpc-client'
import { ClientOnly } from '~/components/ClientOnly'
// import { WalletConnectProvider } from '@penx/wagmi'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

initFower()

interface Props<T> extends AppProps<T> {
  Component: AppProps<T>['Component'] & {
    Layout: any
    session: Session
  }
}

if (!isServer) {
  // TODO: move this code to a separate file
}

function MyApp({ Component, pageProps }: Props<any>) {
  const Layout = Component.Layout ? Component.Layout : Fragment

  return (
    <>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <GoogleAnalytics trackPageViews />

      <ClientOnly>
        <WalletConnectProvider>
          <TrpcProvider>
            {/* <SpeedInsights /> */}
            <Layout>
              <Component {...pageProps} />
              <div id="portal" />
            </Layout>
            <ToastContainer position="bottom-right" />

            {/* <Analytics /> */}
          </TrpcProvider>
        </WalletConnectProvider>
      </ClientOnly>
    </>
  )
}

export default api.withTRPC(MyApp)
