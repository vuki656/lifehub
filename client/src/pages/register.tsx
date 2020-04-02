import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import React, { useCallback } from 'react'
import { useField, useForm } from 'react-final-form-hooks'

import { ReactComponent as Logo } from '../assets/images/TextLogo.svg'

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
            container
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid xs={4} item>
                <Grid xs={12} item>
                    <Logo className="logo" />
                </Grid>
                <Grid xs={12} item>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            {...username.input}
                            autoComplete="username"
                            type="text"
                            label="Username"
                            required
                            fullWidth
                        />
                        <TextField
                            {...email.input}
                            autoComplete="email"
                            type="email"
                            label="Email"
                            required
                            fullWidth
                        />
                        <TextField
                            {...password.input}
                            autoComplete="new-password"
                            label="Password"
                            type="password"
                            required
                            fullWidth
                        />
                        <TextField
                            {...passwordConfirmation.input}
                            autoComplete="new-password"
                            label="Repeat Password"
                            type="password"
                            required
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Register
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </Grid>
    )
}
