import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout/index.layout'
import Head from 'next/head'
import IntroContextProvider from '@/context/Intro.context'


export default function App({ Component, pageProps }: AppProps) {
  return (
  <IntroContextProvider>
    <Layout>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head>
      <Component {...pageProps} />
    </Layout> 
  </IntroContextProvider>
)
}
