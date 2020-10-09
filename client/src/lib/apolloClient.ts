import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import getConfig from 'next/config'
import { useMemo } from 'react'

let existingApolloClient: ApolloClient<NormalizedCacheObject>

const ssrInProgress = typeof window === 'undefined'

const createApolloClient = () => {
    const { publicRuntimeConfig } = getConfig()

    const httpLink = new HttpLink({
        credentials: 'same-origin',
        uri: publicRuntimeConfig.API_URL,
    })

    const authLink = setContext((operation, prevContext) => {
        const { headers } = prevContext

        const bearerToken = !ssrInProgress && `Bearer ${localStorage.getItem('token')}`
        const userId = !ssrInProgress && localStorage.getItem('userId')

        return {
            headers: {
                ...headers,
                token: bearerToken,
                userId,
            },
        }
    })

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
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
