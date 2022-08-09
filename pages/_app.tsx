import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import useSWR, { SWRConfig } from 'swr'

import { lightTheme } from '../themes';
import { CartProvider, UiProvider } from '../context';
import { AuthProvider } from '../context/auth/AuthProvider';
import { SessionProvider } from "next-auth/react"


import { PayPalScriptProvider} from "@paypal/react-paypal-js";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}} >

      

    
    <SWRConfig 
      value={{
       // refreshInterval: 500,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
    <AuthProvider>

      <CartProvider>
        <UiProvider>
        <ThemeProvider theme={ lightTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
        </UiProvider>
      </CartProvider>
    </AuthProvider>
    </SWRConfig>
    </PayPalScriptProvider>
   </SessionProvider>
  )
}

export default MyApp
