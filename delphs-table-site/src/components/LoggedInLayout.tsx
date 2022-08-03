import { Button, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import useIsClientSide from '../hooks/useIsClientSide';
import { useRelayer } from '../hooks/useUser';
import Layout from './Layout'

const LoggedInLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const isClient = useIsClientSide();
  const { ready, login, isLoading } = useRelayer()
  
  useEffect(() => {
    if (isClient && !ready) {
      router.push('/')
    }
  }, [isClient, ready])

  if (!isClient || (!ready && isLoading)) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  if (!ready && !isLoading) {
    return (
      <Layout>
        <Text>You must sign in</Text>
        <Button onClick={login}>Login</Button>
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
