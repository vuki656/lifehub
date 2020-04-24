import { useMutation } from '@apollo/react-hooks'
import React, { useCallback } from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import { Link, useHistory } from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/images/logo/TextLogo.svg'
import { FormErrorMessage } from '../../components/FormErrorMessage'
import { FullScreenTransition } from '../../components/FullScreenTransition'
import { CREATE_USER } from '../../graphql/user/user'
import { createUserResponse, createUserVariables } from '../../graphql/user/user.types'
import { UserErrors } from './Register.types'

export const Register: React.FC<{}> = () => {
    const history = useHistory()

    const [errors, setErrors] = React.useState<UserErrors>({})
    const [createUserMutation, { loading }] = useMutation<createUserResponse, createUserVariables>(CREATE_USER)

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
            .then((response) => {
                const token = response?.data?.createUser.token ?? ''
                window.localStorage.setItem('token', token)

                setErrors({})
                history.push('/dashboard')
            })
            .catch((error) => {
                setErrors(error.graphQLErrors?.[0].extensions.exception)
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
                <div className="form">
                    <div className="form__card">
                        <Logo className="form__logo" />
                        <p className="form__title">Register your account</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Username</p>
                                <input
                                    className="form__input-field"
                                    autoComplete="username"
                                    type="text"
                                    minLength={4}
                                    required
                                    {...username.input}
                                />
                                {errors.username && <FormErrorMessage error={errors.username} />}
                            </div>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Email</p>
                                <input
                                    className="form__input-field"
                                    autoComplete="email"
                                    type="email"
                                    required
                                    {...email.input}
                                />
                                {errors.email && <FormErrorMessage error={errors.email} />}
                            </div>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Password</p>
                                <input
                                    className="form__input-field"
                                    autoComplete="new-password"
                                    type="password"
                                    minLength={7}
                                    required
                                    {...password.input}
                                />
                                {errors.password && <FormErrorMessage error={errors.password} />}
                            </div>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Confirm Password </p>
                                <input
                                    className="form__input-field"
                                    autoComplete="new-password"
                                    type="password"
                                    minLength={7}
                                    required
                                    {...passwordConfirmation.input}
                                />
                            </div>
                            <button className="form__button--wide button--primary" type="submit">
                                Create your account
                            </button>
                        </form>
                        <div className="bottom-info">
                            <p className="bottom-info__text">Already have an account?
                                <Link to="/login" className="bottom-info__link"> Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            )
    )
}
