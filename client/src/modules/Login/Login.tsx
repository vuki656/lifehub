import { useMutation } from '@apollo/react-hooks'
import { useFormik } from 'formik'
import React, { useCallback } from 'react'
import {
    Link,
    useHistory,
} from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/images/logo/TextLogo.svg'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Message } from '../../components/Message'
import { LOGIN_USER } from '../../graphql/user/user'
import {
    logInUserResponse,
    logInUserVariables,
} from '../../graphql/user/user.types'
import { UserErrors } from '../Register'

import { LoginFormTypes } from './Login.types'

export const Login: React.FC = () => {
    const history = useHistory()

    const [errors, setErrors] = React.useState<UserErrors>({})
    const [logInUserQuery, { loading }] = useMutation<logInUserResponse, logInUserVariables>(LOGIN_USER)

    const loginForm = useFormik<LoginFormTypes>({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: (formValues) => handleSubmit(formValues),
    })

    // Log user in
    const handleSubmit = useCallback((formValues: LoginFormTypes) => {
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
            loginForm.resetForm()
            history.push('/dashboard')
        })
        .catch((error) => {
            setErrors(error.graphQLErrors[0]?.extensions)
        })
    }, [logInUserQuery, history, loginForm])

    return (
        <form onSubmit={loginForm.handleSubmit}>
            <div className="form">
                <div className="form__card">
                    <Logo className="form__logo" />
                    <p className="form__title">Sign in</p>
                    <div className="form__field-wrapper">
                        <p className="form__field-title">Email</p>
                        <input
                            className="form__input-field"
                            autoComplete="email"
                            type="email"
                            name="email"
                            required
                            onChange={loginForm.handleChange}
                            value={loginForm.values.email}
                        />
                        {errors.email && <Message message={errors.email} type="error" />}
                    </div>
                    <div className="form__field-wrapper">
                        <p className="form__field-title">Password</p>
                        <input
                            className="form__input-field"
                            autoComplete="password"
                            type="password"
                            name="password"
                            minLength={7}
                            required
                            onChange={loginForm.handleChange}
                            value={loginForm.values.password}
                        />
                        {errors.password && <Message message={errors.password} type="error" />}
                    </div>
                    <button
                        className="form__button--wide button button--primary"
                        type="submit"
                    >
                        {loading
                            ? <LoadingSpinner loaderColor={'white'} loaderVariant={'button'} />
                            : 'Login'
                        }
                    </button>
                    <div className="bottom-info">
                        <p className="bottom-info__text">Don&lsquot have an account?
                            <Link to="/" className="bottom-info__link"> Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}
