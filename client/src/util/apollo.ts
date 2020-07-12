import ApolloClient from 'apollo-boost'

import store from '../redux/store'

const bearerToken = 'Bearer ' + localStorage.getItem('token')
let fetchedStore

// Subscription is needed to get the latest state, if not subscribed, initial empty state is always returned.
store.subscribe(() => {
    fetchedStore = store.getState()
})

export const client = new ApolloClient({
    request: (operation) => {
        operation.setContext({
            headers: {
                token: bearerToken,
                userId: fetchedStore.user.user.id, // TODO:  refactor to something more sensible
            },
        })
    },
    uri: 'http://localhost:4000',
})
