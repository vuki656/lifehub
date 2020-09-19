import {
    ApolloError,
    useMutation,
} from "@apollo/client"
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import * as React from 'react'
import { LOGIN_USER } from '../../graphql/mutations'
import {
    LogInUserMutation,
    LogInUserMutationVariables,
} from '../../graphql/types'
import { TextField } from '../../ui-kit/components'
import { Button } from '../../ui-kit/components/Button'

import {
    LoginPanel,
    LoginRoot,
} from './Login.styles'
import { LoginFormTypes } from './Login.types'

export const Login: React.FunctionComponent = () => {
    const { push } = useRouter()

    const [
        logInUserMutation,
        { loading },
    ] = useMutation<LogInUserMutation, LogInUserMutationVariables>(LOGIN_USER)

    const handleSubmit = React.useCallback(async(formValues: LoginFormTypes) => {
        await logInUserMutation({
            variables: {
                input: {
                    email: formValues.email,
                    password: formValues.password,
                },
            },
        })
            .then((response) => {
                const token = response?.data?.logInUser.token ?? ''
                const userId = response?.data?.logInUser.userId ?? ''

                window.localStorage.setItem(
                    'token',
                    token
                )

                window.localStorage.setItem(
                    'userId',
                    userId
                )

                push('/dashboard')
            })
            .catch((error: ApolloError) => {
                console.log(error.graphQLErrors)
            })
    }, [logInUserMutation, push])

    const form = useFormik<LoginFormTypes>({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: (formValues) => {
            handleSubmit(formValues)
        },
    })

    return (
        <LoginRoot>
            <form onSubmit={form.handleSubmit}>
                <LoginPanel spacing="lg">
                    <TextField
                        label="Email"
                        name="email"
                        onChange={form.handleChange}
                        required
                        value={form.values.email}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        onChange={form.handleChange}
                        required
                        value={form.values.password}
                    />
                    <Button
                        fullWidth
                        loading={loading}
                        type="submit"
                    >
                        Login
                    </Button>
                </LoginPanel>
            </form>
        </LoginRoot>
    )
}
