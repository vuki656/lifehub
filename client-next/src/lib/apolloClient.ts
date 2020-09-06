import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client'
import getConfig from 'next/config'
import { useMemo } from 'react'

const { publicRuntimeConfig } = getConfig()

let existingApolloClient: ApolloClient<NormalizedCacheObject>

const ssrInProgress = typeof window === 'undefined'

const bearerToken = !ssrInProgress && 'Bearer ' + localStorage.getItem('token')
const userId = !ssrInProgress && localStorage.getItem('userId')

function createApolloClient() {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            credentials: 'same-origin',
            headers: {
                token: bearerToken,
                userId,
            },
            uri: publicRuntimeConfig.API_URL,
        }),
        ssrMode: !ssrInProgress,
    })
}

export function initializeApollo(initialState = {}): ApolloClient<NormalizedCacheObject> {
    const apolloClient = existingApolloClient ?? createApolloClient()

    if (initialState) {
        const existingCache = apolloClient.extract()

        apolloClient.cache.restore({
            ...existingCache,
            ...initialState,
        })
    }

    if (typeof window === 'undefined') {
        return apolloClient
    }

    if (!existingApolloClient) {
        existingApolloClient = apolloClient
    }

    return apolloClient
}

export const useApollo = (initialState: ApolloClient<NormalizedCacheObject>): ApolloClient<NormalizedCacheObject> => {
    return initializeApollo(initialState)
}
