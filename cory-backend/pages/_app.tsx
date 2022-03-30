import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import RouteGuard from '../components/RouteGuard';
import { wrapper } from '../redux/store';
import { NotificationProvider } from '../components/Notification/Notification';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/himitukichi/images/favicon.ico" />
        <title>こりーのホームページ</title>
      </Head>
      <RouteGuard>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </RouteGuard>
    </>
  )
}

export default wrapper.withRedux(MyApp);