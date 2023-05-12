import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { SiweMessage } from "siwe"
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi"
import Layout from "../components/layout"
import { useEffect } from "react"
import { GoogleSocialWalletConnector } from '@zerodevapp/wagmi'
const googleConnector = new GoogleSocialWalletConnector({options: {
    projectId: 'b5486fa4-e3d9-450b-8428-646e757c10f6',
}})

function Siwe() {
  const { signMessageAsync } = useSignMessage()
  const { chain } = useNetwork()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: googleConnector ,
  });

  const { data: session } = useSession()

  const handleLogin = async () => {
    try {
      const callbackUrl = "/protected"
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      })
      const preparedMessage = message.prepareMessage()
      const signature = await signMessageAsync({
        message: preparedMessage
      })
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      })
    } catch (error) {
      window.alert(error)
    }
  }

  useEffect(() => {
    //   disconnect()
  }, [])

  useEffect(() => {
    console.log(isConnected);
    if (isConnected && !session) {
      handleLogin()
    }
  }, [isConnected])

  return (
    <Layout>
      <button
        onClick={(e) => {
          e.preventDefault()
          if (!isConnected) {
            connect()
          } else {
            handleLogin()
          }
        }}
      >
        Sign-in
      </button>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}

Siwe.Layout = Layout

export default Siwe