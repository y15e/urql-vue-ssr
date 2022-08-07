import { createClient } from '@urql/vue'

import {
  dedupExchange,
  fetchExchange,
  ssrExchange,
  subscriptionExchange
} from '@urql/core'

import { devtoolsExchange } from '@urql/devtools'
import { offlineExchange } from '@urql/exchange-graphcache'
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage'

import fetch from 'cross-fetch'

import schema from './schema.json'

export async function createUrqlClient(context: any) {
  
  // SSR
  const isServerSide = typeof window === 'undefined'
  const ssr = ssrExchange({
    isClient: !isServerSide,
    initialState: !isServerSide ? window.__URQL_DATA__ : undefined
  })
  
  // Storage
  const storage = isServerSide ? undefined : makeDefaultStorage({})
  
  // Cache
  const cache = offlineExchange({ schema, storage })
  
  // urql client
  const urqlClient = createClient({
    url: 'https://demotivation-quotes-api.herokuapp.com/graphql',
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cache,
      ssr,
      fetchExchange
    ],
    fetch
  })
  
  return { urqlClient, ssr }
}