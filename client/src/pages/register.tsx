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
    const [createUserMutation, { loading }] = useMutation(CREATE_USER)
    const [error, setError] = React.useState('')

    // Save user in database
    const onSubmit = useCallback((formValues) => {
        createUserMutation({
            variables: {
                username: formValues.username,
                email: formValues.email,
                password: formValues.password,
            },
        })
        .catch((error) => {
            console.error(error)
        })
        .finally(() => {
            setLoading(false)
        })

    }, [createUserMutation])

    const { form, handleSubmit } = useForm({ onSubmit })

    const username = useField('username', form)
    const email = useField('email', form)
    const password = useField('password', form)
    const passwordConfirmation = useField('passwordConfirmation', form)

    return (
        loading
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
                                {username.meta.touched && username.meta.error && (
                                    <span>{username.meta.error}</span>
                                )}
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
                        <Grid xs={12} item>
                            {error}
                        </Grid>
                    </Grid>
                </Grid>
            )
    )
}
