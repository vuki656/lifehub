import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from "@apollo/client"
import getConfig from 'next/config'
import { useMemo } from 'react'

const { publicRuntimeConfig } = getConfig()

let existingApolloClient: ApolloClient<NormalizedCacheObject>

const ssrInProgress = typeof window === 'undefined'

const createApolloClient = () => {
    const bearerToken = !ssrInProgress && `Bearer ${localStorage.getItem('token')}`
    const userId = !ssrInProgress && localStorage.getItem('userId')

    const httpLink = new HttpLink({
        credentials: 'same-origin',
        headers: {
            token: bearerToken,
            userId,
        },
        uri: publicRuntimeConfig.API_URL,
    })


    return new ApolloClient({
        cache: new InMemoryCache(),
        link: httpLink,
        ssrMode: ssrInProgress,
    })
}

const initializeApollo = (initialState: NormalizedCacheObject) => {
    const refreshedApolloClient = existingApolloClient ?? createApolloClient()

    if (initialState) {
        refreshedApolloClient.cache.restore(initialState)
    }

    if (ssrInProgress) {
        return refreshedApolloClient
    }

    if (!existingApolloClient) {
        existingApolloClient = refreshedApolloClient
    }

    return refreshedApolloClient
}

export const useApollo = (initialState: NormalizedCacheObject): ApolloClient<NormalizedCacheObject> => {
    return useMemo(() => {
        return initializeApollo(initialState)
    }, [initialState])
}
