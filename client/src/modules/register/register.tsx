import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import React, { useCallback } from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import { useHistory } from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/images/logo/TextLogo.svg'
import { FormErrorBox } from '../../components/FormErrorBox'
import { FullScreenTransition } from '../../components/FullScreenTransition'
import { CREATE_USER } from '../../graphql/user/user'
import { createUserVariables } from '../../graphql/user/user.types'
import { UserErrors } from './register.types'

export const Register: React.FunctionComponent<{}> = () => {
    const history = useHistory()
    const [errors, setErrors] = React.useState<UserErrors>({})
    const [createUserMutation, { loading }] = useMutation<createUserVariables>(CREATE_USER)

    // Save user in database
    const onSubmit = useCallback((formValues) => {
        createUserMutation({
            variables: {
                username: formValues.username,
                email: formValues.email,
                password: formValues.password,
                passwordConfirmation: formValues.passwordConfirmation,
            },
        })
        .then(() => {
            setErrors({})
            history.push('/dashboard')
        })
        .catch((error) => {
            setErrors(error.graphQLErrors[0].extensions.exception)
        })
    }, [createUserMutation, history])

    const { form, handleSubmit } = useForm({ onSubmit })

    const username = useField('username', form)
    const email = useField('email', form)
    const password = useField('password', form)
    const passwordConfirmation = useField('passwordConfirmation', form)

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
                            <p className="form__title">Register your account</p>
                        </Grid>
                        <Grid xs={12} item>
                            <form onSubmit={handleSubmit}>
                                <div className="form__field-wrapper">
                                    <p className="form__field-title">Username</p>
                                    <input
                                        {...username.input}
                                        className="form__input-field"
                                        autoComplete="username"
                                        type="text"
                                        minLength={4}
                                        required
                                    />
                                    {errors.username && <FormErrorBox error={errors.username} />}
                                </div>
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
                                <div className="form__field-wrapper">
                                    <p className="form__field-title">Confirm Password </p>
                                    <input
                                        {...passwordConfirmation.input}
                                        className="form__input-field"
                                        autoComplete="new-password"
                                        type="password"
                                        minLength={7}
                                        required
                                    />
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
                                        Create your account
                                    </Button>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Grid>
            )
    )
}
