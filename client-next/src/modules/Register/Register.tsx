import {
    ApolloError,
    useMutation,
} from "@apollo/client"
import dayjs from "dayjs"
import { useFormik } from "formik"
import Link from "next/link"
import { useRouter } from "next/router"
import * as React from 'react'

import { REGISTER_USER } from "../../graphql/mutations"
import {
    RegisterUserMutation,
    RegisterUserMutationVariables,
} from "../../graphql/types"
import {
    Button,
    Divider,
    TextField,
} from "../../ui-kit/components/"

import {
    RegisterFooterLink,
    RegisterFooterText,
    RegisterPanel,
    RegisterRoot,
} from "./Register.styles"
import {
    RegisterFormErrorType,
    RegisterFormType,
} from "./Register.types"

export const Register: React.FunctionComponent = () => {
    const { push } = useRouter()

    const [errors, setErrors] = React.useState<RegisterFormErrorType>({})

    const [
        registerMutation,
        { loading },
    ] = useMutation<RegisterUserMutation, RegisterUserMutationVariables>(REGISTER_USER)

    const handleSubmit = React.useCallback(async(formValues: RegisterFormType) => {
        await registerMutation({
            variables: {
                input: {
                    email: formValues.email,
                    password: formValues.password,
                    passwordConfirmation: formValues.passwordConfirmation,
                    username: formValues.username,
                },
            },
        })
        .then((response) => {
            const token = response?.data?.registerUser.token ?? ''
            const userId = response?.data?.registerUser.userId ?? ''

            window.localStorage.setItem(
                'token',
                token
            )

            window.localStorage.setItem(
                'userId',
                userId
            )

            push(`/dashboard/${dayjs().format("MM-DD-YYYY")}`)
        })
        .catch((error: ApolloError) => {
            setErrors({ ...error.graphQLErrors[0].extensions?.exception })
        })
    }, [push, registerMutation])

    const form = useFormik<RegisterFormType>({
        initialValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
            username: '',
        },
        onSubmit: (formValues) => {
            handleSubmit(formValues)
        },
    })

    return (
        <RegisterRoot>
            <form onSubmit={form.handleSubmit}>
                <RegisterPanel spacing="lg">
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
                        autoComplete="username"
                        error={Boolean(errors.username)}
                        fullWidth
                        helperText={errors.username}
                        label="Username"
                        name="username"
                        onChange={form.handleChange}
                        required
                        value={form.values.username}
                    />
                    <TextField
                        autoComplete="new-password"
                        error={Boolean(errors.password)}
                        fullWidth
                        helperText={errors.password}
                        label="Password"
                        minLength={8}
                        name="password"
                        onChange={form.handleChange}
                        required
                        type="password"
                        value={form.values.password}
                    />
                    <TextField
                        autoComplete="new-password"
                        fullWidth
                        label="Repeat Password"
                        minLength={8}
                        name="passwordConfirmation"
                        onChange={form.handleChange}
                        required
                        type="password"
                        value={form.values.passwordConfirmation}
                    />
                    <Button
                        fullWidth
                        loading={loading}
                        type="submit"
                    >
                        Register
                    </Button>
                    <Divider />
                    <RegisterFooterText>
                        Already have an account?{" "}
                        <Link href="/login">
                            <RegisterFooterLink>
                                Login
                            </RegisterFooterLink>
                        </Link>
                    </RegisterFooterText>
                </RegisterPanel>
            </form>
        </RegisterRoot>
    )
}
