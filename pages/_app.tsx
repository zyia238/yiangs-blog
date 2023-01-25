import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout/index.layout'
import Head from 'next/head'
import IntroContextProvider from '@/context/Intro.context'
import { SessionProvider } from "next-auth/react"
import ErrorBoundary from '@/components/ErrorBoundaries/index'


export default function App({ Component, pageProps : {session , ...pageProps} }: AppProps) {
  return (
  <ErrorBoundary >
    <SessionProvider session={session}>
        <IntroContextProvider>
          <Layout>
            <Head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </Head>
            <Component {...pageProps} />
          </Layout> 
        </IntroContextProvider>
    </SessionProvider>
  </ErrorBoundary>
)
}
