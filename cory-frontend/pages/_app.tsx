import '../styles/globals.css'
import Head from 'next/head';
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <title>こりーのホーム</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
