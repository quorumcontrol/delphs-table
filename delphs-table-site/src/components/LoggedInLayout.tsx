import { Button, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import useIsClientSide from '../hooks/useIsClientSide';
import { useDeviceSigner } from '../hooks/useUser';
import Layout from './Layout'

const LoggedInLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const isClient = useIsClientSide();
  const { data:signer, isFetched, isLoading, login, isTrustedDevice } = useDeviceSigner()

  useEffect(() => {
    if (isClient && isFetched && !isTrustedDevice) {
      router.push('/')
    }
  }, [isClient, isFetched, isTrustedDevice])

  if (!isClient || (!signer && isLoading)) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  if (!signer && !isLoading && isTrustedDevice) {
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