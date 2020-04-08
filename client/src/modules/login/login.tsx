import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import React, { useCallback } from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import { useHistory } from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/images/logo/TextLogo.svg'
import { FormErrorBox } from '../../components/FormErrorBox'
import { FullScreenTransition } from '../../components/FullScreenTransition'
import { UserErrors } from '../register'

export const Login: React.FunctionComponent<{}> = () => {
    const history = useHistory()
    const [errors, setErrors] = React.useState<UserErrors>({})

    // Save user in database
    const onSubmit = useCallback((formValues) => {
        console.log('lgin')
    }, [])

    const { form, handleSubmit } = useForm({ onSubmit })

    const email = useField('email', form)
    const password = useField('password', form)

    return (
        loading
            ? <FullScreenTransition isLoadingActive={loading} />
            : (
                <Grid
                    alignItems="center"
                    justify="center"
                    className="form"
                    container
                >
                    <Grid
                        xs={3}
                        className="form__card"
                        item
                    >
                        <Grid xs={12} item>
                            <Logo className="form__logo" />
                            <p className="form__title">Sign in</p>
                        </Grid>
                        <Grid xs={12} item>
                            <form onSubmit={handleSubmit}>
                                <div className="form__field-wrapper">
                                    <p className="form__field-title">Email</p>
                                    <input
                                        {...email.input}
                                        className="form__input-field"
                                        autoComplete="email"
                                        type="email"
                                        required
                                    />
                                    {errors.email && <FormErrorBox error={errors.email} />}
                                </div>
                                <div className="form__field-wrapper">
                                    <p className="form__field-title">Password</p>
                                    <input
                                        {...password.input}
                                        className="form__input-field"
                                        autoComplete="new-password"
                                        type="password"
                                        minLength={7}
                                        required
                                    />
                                    {errors.password && <FormErrorBox error={errors.password} />}
                                </div>

                                <Grid
                                    alignItems="center"
                                    justify="center"
                                    container
                                >
                                    <Button
                                        className="form__button button-main"
                                        type="submit"
                                    >
                                        Login
                                    </Button>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Grid>
            )
    )
}
