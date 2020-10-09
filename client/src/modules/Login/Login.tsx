import {
    ApolloError,
    useMutation,
} from "@apollo/client"
import dayjs from "dayjs"
import { useFormik } from 'formik'
import Link from "next/link"
import { useRouter } from 'next/router'
import * as React from 'react'

import { LOGIN_USER } from '../../graphql/mutations'
import {
    LogInUserMutation,
    LogInUserMutationVariables,
} from '../../graphql/types'
import {
    Button,
    Divider,
    TextField,
} from '../../ui-kit/components'

import {
    LoginFooterLink,
    LoginFooterText,
    LoginPanel,
    LoginRoot,
} from './Login.styles'
import {
    LoginFormErrorType,
    LoginFormTypes,
} from './Login.types'

export const Login: React.FunctionComponent = () => {
    const { push } = useRouter()

    const [errors, setErrors] = React.useState<LoginFormErrorType>({})

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
        .then(async(response) => {
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

            await push(
                '/dashboard/[selectedDate]',
                `/dashboard/${dayjs().format("MM-DD-YYYY")}`,
            )
        })
        .catch((error: ApolloError) => {
            setErrors({ ...error.graphQLErrors[0].extensions?.exception })
        })
    }, [
        logInUserMutation,
        push,
    ])

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
                    <img src="/images/text-logo.png" />
                    <TextField
                        autoComplete="email"
                        error={Boolean(errors.email)}
                        fullWidth
                        helperText={errors.email}
                        label="Email"
                        name="email"
                        onChange={form.handleChange}
                        required
                        value={form.values.email}
                    />
                    <TextField
                        autoComplete="password"
                        error={Boolean(errors.password)}
                        fullWidth
                        helperText={errors.password}
                        label="Password"
                        name="password"
                        onChange={form.handleChange}
                        required
                        type="password"
                        value={form.values.password}
                    />
                    <Button
                        fullWidth
                        loading={loading}
                        type="submit"
                    >
                        Login
                    </Button>
                    <Divider />
                    <LoginFooterText>
                        Don&apos;t have an account?{" "}
                        <Link href="/register">
                            <LoginFooterLink>
                                Register
                            </LoginFooterLink>
                        </Link>
                    </LoginFooterText>
                </LoginPanel>
            </form>
        </LoginRoot>
    )
}
