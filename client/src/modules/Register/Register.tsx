import { useMutation } from '@apollo/react-hooks'
import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/images/logo/TextLogo.svg'
import { ErrorMessage } from '../../components/ErrorMessage'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { CREATE_USER } from '../../graphql/user/user'
import { createUserResponse, createUserVariables } from '../../graphql/user/user.types'
import { useFormFields } from '../../util/hooks/useFormFields.hook'
import { UserErrors } from './Register.types'

// TODO fix register not working
export const Register: React.FC<{}> = () => {
    const history = useHistory()

    const [errors, setErrors] = React.useState<UserErrors>({})
    const [createUserMutation, { loading }] = useMutation<createUserResponse, createUserVariables>(CREATE_USER)
    const { formValues, setFormValue, clearForm } = useFormFields({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    })

    // Save user in database
    const createUser = useCallback(() => {
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
            clearForm()
            history.push('/dashboard')
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        clearForm,
        createUserMutation,
        formValues.email,
        formValues.username,
        formValues.password,
        formValues.passwordConfirmation,
        history,
    ])

    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        createUser()
    }, [createUser])

    return (
        loading
            ? <LoadingSpinner loaderColor={'blue'} loaderVariant={'fullScreen'} />
            : (
                <form onSubmit={handleSubmit}>
                    <div className="form">
                        <div className="form__card">
                            <Logo className="form__logo" />
                            <p className="form__title">Register your account</p>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Username</p>
                                <input
                                    className="form__input-field"
                                    autoComplete="username"
                                    type="text"
                                    minLength={4}
                                    required
                                    value={formValues.username}
                                    onChange={({ target }) => setFormValue(target.value, 'username')}
                                />
                                {errors.username && <ErrorMessage error={errors.username} />}
                            </div>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Email</p>
                                <input
                                    className="form__input-field"
                                    autoComplete="email"
                                    type="email"
                                    required
                                    value={formValues.email}
                                    onChange={({ target }) => setFormValue(target.value, 'email')}
                                />
                                {errors.email && <ErrorMessage error={errors.email} />}
                            </div>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Password</p>
                                <input
                                    className="form__input-field"
                                    autoComplete="new-password"
                                    type="password"
                                    minLength={7}
                                    required
                                    value={formValues.password}
                                    onChange={({ target }) => setFormValue(target.value, 'password')}
                                />
                                {errors.password && <ErrorMessage error={errors.password} />}
                            </div>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Confirm Password </p>
                                <input
                                    className="form__input-field"
                                    autoComplete="new-password"
                                    type="password"
                                    minLength={7}
                                    required
                                    value={formValues.passwordConfirmation}
                                    onChange={({ target }) => setFormValue(target.value, 'passwordConfirmation')}
                                />
                            </div>
                            <button className="form__button--wide button button--primary" type="submit">
                                Create your account
                            </button>
                            <div className="bottom-info">
                                <p className="bottom-info__text">Already have an account?
                                    <Link to="/login" className="bottom-info__link"> Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            )
    )
}
