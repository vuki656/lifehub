import ApolloClient from 'apollo-boost'

import store from '../redux/store'

const bearerToken = 'Bearer ' + localStorage.getItem('token')
const fetchedStore = store.getState()

export const client = new ApolloClient({
    request: (operation) => {
        operation.setContext({
            headers: {
                token: bearerToken,
                user: fetchedStore.user.user, // TODO:  refactor to something more sensible
            },
        })
    },
    uri: 'http://localhost:4000',
})
