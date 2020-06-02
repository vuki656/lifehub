import ApolloClient from 'apollo-boost'

export const client = new ApolloClient({
    request: (operation) => {
        operation.setContext({ headers: { authorization: localStorage.getItem('token') } })
    },
    uri: 'http://localhost:4000',
})
