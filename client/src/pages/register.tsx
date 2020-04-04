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
    const [errorList, addError] = React.useState<string[]>([])
    const [createUserMutation] = useMutation(CREATE_USER)

    // Save user in database
    const onSubmit = useCallback((formValues) => {
        setLoading(true)
        createUserMutation({
            variables: {
                username: formValues.username,
                email: formValues.email,
                password: formValues.password,
            },
        })
        .catch((error) => {
            isFormValid(error, formValues)
            console.error(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [isLoadingActive])

    // Check if given form values are valid, if not, return false
    // Codes are returned from apollo
    const isFormValid = React.useCallback((error?, formValues?) => {
        // Clear error messages before new check
        addError([])

        // If duplicate username
        if (error.message.includes('UQ_fe0bb3f6520ee0469504521e710')) {
            addError(() => errorList.concat('Username already in use. Please pick a different one'))
        }

        // If duplicate email
        if (error.message.includes('UQ_97672ac88f789774dd47f7c8be3')) {
            addError(() => errorList.concat('Email already in use. Please pick a different one'))
        }

        // If passwords don't match
        if (formValues.password !== formValues.passwordConfirmation) {
            addError(() => errorList.concat('Passwords don\'t match'))
        }

        // TODO handle email + user valid but passwords dont match
    }, [errorList])

    const renderErrors = () => (
        errorList.map((error, index) => (
            <p key={index}>{error}</p>
        ))
    )

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
                            {renderErrors()}
                        </Grid>
                    </Grid>
                </Grid>
            )
    )
}
