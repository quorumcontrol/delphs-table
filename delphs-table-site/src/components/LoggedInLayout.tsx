import { Button, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import useIsClientSide from '../hooks/useIsClientSide';
import { useLogin } from '../hooks/useUser';
import Layout from './Layout'

const LoggedInLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const isClient = useIsClientSide();
  const { isLoggedIn, login, isLoggingIn } = useLogin()
  
  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push('/')
    }
  }, [isClient, isLoggedIn])

  if (!isClient || (!isLoggedIn && isLoggingIn)) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  if (!isLoggedIn && !isLoggedIn) {
    return (
      <Layout>
        <Text>You must sign in</Text>
        <Button onClick={() => login()}>Login</Button>
      </Layout>
    )
  }

  return (
    <Layout>
      {children}
    </Layout>
  )
}

export default LoggedInLayout
