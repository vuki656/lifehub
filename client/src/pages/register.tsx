import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import React, { useCallback } from 'react'
import { useField, useForm } from 'react-final-form-hooks'

import { ReactComponent as Logo } from '../assets/images/logo/TextLogo.svg'

export const RegisterPage: React.FunctionComponent<{}> = () => {
    const onSubmit = useCallback((formValues) => {
        console.log(formValues)
    }, [])

    const { form, handleSubmit } = useForm({ onSubmit })

    const username = useField('username', form)
    const email = useField('email', form)
    const password = useField('password', form)
    const passwordConfirmation = useField('passwordConfirmation', form)

    return (
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
                                className="register-form__button"
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
}
