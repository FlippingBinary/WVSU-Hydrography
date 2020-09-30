import type { AppProps } from 'next/app'
import 'antd/dist/antd.css'

function HydrologyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default HydrologyApp
