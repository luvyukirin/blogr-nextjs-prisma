import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { Session } from "next-auth";

type MyAppProps = AppProps<{
  session: Session;
}>;

const App = ({ Component, pageProps }: MyAppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;