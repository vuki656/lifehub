import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import React, { useCallback } from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import { Link, useHistory } from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/images/logo/TextLogo.svg'
import { FormErrorMessage } from '../../components/FormErrorMessage'
import { FullScreenTransition } from '../../components/FullScreenTransition'
import { LOGIN_USER } from '../../graphql/user/user'
import { logInUserResponse, logInUserVariables } from '../../graphql/user/user.types'
import { UserErrors } from '../register'

export const Login: React.FunctionComponent<{}> = () => {
    const history = useHistory()

    const [errors, setErrors] = React.useState<UserErrors>({})
    const [logInUserQuery, { loading = true }] = useMutation<logInUserResponse, logInUserVariables>(LOGIN_USER)

    // Log user in
    const onSubmit = useCallback((formValues) => {
        logInUserQuery({
            variables: {
                email: formValues.email,
                password: formValues.password,
            },
        })
            .then((response) => {
                const token = response?.data?.logInUser.token ?? ''
                window.localStorage.setItem('token', token)

                setErrors({})
                history.push('/dashboard')
            })
            .catch((error) => {
                setErrors(error.graphQLErrors[0]?.extensions)
            })
    }, [logInUserQuery, history])

    const { form, handleSubmit } = useForm({ onSubmit })

    const email = useField('email', form)
    const password = useField('password', form)

    return (
        loading
            ? <FullScreenTransition isLoadingActive={loading} />
            : (
                <div className="form">
                    <div className="form__card">
                        <Logo className="form__logo" />
                        <p className="form__title">Sign in</p>
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
                                {errors.email && <FormErrorMessage error={errors.email} />}
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
                                {errors.password && <FormErrorMessage error={errors.password} />}
                            </div>
                            <Button
                                className="form__button button-main"
                                type="submit"
                            >
                                Login
                            </Button>
                        </form>
                        <div className="bottom-info">
                            <p className="bottom-info__text">Don't have an account?
                                <Link to="/" className="bottom-info__link"> Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            )
    )
}
