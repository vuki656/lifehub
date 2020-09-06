import ApolloClient from 'apollo-boost'

const bearerToken = 'Bearer ' + localStorage.getItem('token')
const userId = localStorage.getItem('userId')

export const client = new ApolloClient({
    request: (operation) => {
        operation.setContext({
            headers: {
                token: bearerToken,
                userId,
            },
        })
    },
    uri: 'http://localhost:4000',
})
