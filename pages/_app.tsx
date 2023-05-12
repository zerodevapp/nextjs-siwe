import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import { WagmiConfig, createClient, configureChains } from "wagmi"
import * as chain from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import "./styles.css"

export const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [publicProvider()]
)

const client = createClient({
  autoConnect: false,
  provider,
})

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Component {...pageProps} />
      </SessionProvider>
    </WagmiConfig>
  )
}