import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import React, { useCallback } from 'react'
import { useField, useForm } from 'react-final-form-hooks'

import { ReactComponent as Logo } from '../assets/images/logo/TextLogo.svg'
import { FullScreenTransition } from '../components/FullScreenTransition'
import { CREATE_USER } from '../graphql/mutations/user'

export const RegisterPage: React.FunctionComponent<{}> = () => {
    const [isLoadingActive, setLoading] = React.useState(false)

    const [createUserMutation] = useMutation(CREATE_USER)

    // Save user
    const onSubmit = useCallback(({ username, email, password }) => {
        setLoading(true)

        createUserMutation({
            variables: {
                username,
                email,
                password,
            },
        })
        .catch((error) => {
            console.error(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [isLoadingActive])

    const { form, handleSubmit } = useForm({ onSubmit })

    const username = useField('username', form)
    const email = useField('email', form)
    const password = useField('password', form)
    const passwordConfirmation = useField('passwordConfirmation', form)

    return (
        isLoadingActive
            ? <FullScreenTransition isLoadingActive={isLoadingActive} />
            : (
                <Grid
                    alignItems="center"
                    justify="center"
                    className="register-form"
                    container
                >
                    <Grid
                        xs={3}
                        className="register-form__card"
                        item
                    >
                        <Grid xs={12} item>
                            <Logo className="register-form__logo" />
                        </Grid>
                        <Grid xs={12} item>
                            <form onSubmit={handleSubmit}>
                                <input
                                    {...username.input}
                                    className="register-form__input-field"
                                    placeholder="Username"
                                    autoComplete="username"
                                    type="text"
                                    minLength={4}
                                    required
                                />
                                <input
                                    {...email.input}
                                    className="register-form__input-field"
                                    autoComplete="email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                />
                                <input
                                    {...password.input}
                                    className="register-form__input-field"
                                    autoComplete="new-password"
                                    placeholder="Password"
                                    type="password"
                                    minLength={7}
                                    required
                                />
                                <input
                                    {...passwordConfirmation.input}
                                    className="register-form__input-field"
                                    autoComplete="new-password"
                                    placeholder="Repeat Password"
                                    type="password"
                                    minLength={7}
                                    required
                                />
                                <Grid
                                    alignItems="center"
                                    justify="center"
                                    container
                                >
                                    <Button
                                        className="button-main"
                                        type="submit"
                                    >
                                        Register
                                    </Button>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Grid>
            )
    )
}
