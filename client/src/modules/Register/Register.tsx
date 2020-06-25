import { useMutation } from '@apollo/react-hooks'
import { useFormik } from 'formik'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
    Link,
    useHistory,
} from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/images/logo/TextLogo.svg'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Message } from '../../components/Message'
import { REGISTER_USER } from '../../graphql/mutations/user.mutations'
import {
    RegisterUserMutation,
    RegisterUserMutationVariables,
} from '../../graphql/types'
import { setUser } from '../../redux/actions/userActions'

import type {
    RegisterFormTypes,
    UserErrors,
} from './Register.types'

export const Register: React.FC = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const [errors, setErrors] = React.useState<UserErrors>({})
    const [RegisterUserMutation, { loading }] = useMutation<RegisterUserMutation, RegisterUserMutationVariables>(REGISTER_USER)

    const registerForm = useFormik<RegisterFormTypes>({
        initialValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
            username: '',
        },
        onSubmit: (formValues) => handleSubmit(formValues),
    })

    // Save user in database
    const handleSubmit = useCallback((formValues: RegisterFormTypes) => {
        RegisterUserMutation({
            variables: {
                input: {
                    email: formValues.email,
                    password: formValues.password,
                    passwordConfirmation: formValues.passwordConfirmation,
                    username: formValues.username,
                },
            },
        })
        .then((response) => {
            const token = response?.data?.registerUser.token ?? ''
            const user = response?.data?.registerUser.user

            window.localStorage.setItem('token', token)
            dispatch(setUser(user))

            setErrors({})
            registerForm.resetForm()
            history.push('/dashboard')
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [RegisterUserMutation, history, registerForm])

    return (
        loading
            ? <LoadingSpinner loaderColor={'blue'} loaderVariant={'fullScreen'} />
            : (
                <form onSubmit={registerForm.handleSubmit}>
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
                                    name="username"
                                    onChange={registerForm.handleChange}
                                    value={registerForm.values.username}
                                />
                                {errors.username && <Message message={errors.username} type="error" />}
                            </div>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Email</p>
                                <input
                                    className="form__input-field"
                                    autoComplete="email"
                                    type="email"
                                    required
                                    name="email"
                                    onChange={registerForm.handleChange}
                                    value={registerForm.values.email}
                                />
                                {errors.email && <Message message={errors.email} type="error" />}
                            </div>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Password</p>
                                <input
                                    className="form__input-field"
                                    autoComplete="new-password"
                                    type="password"
                                    minLength={7}
                                    required
                                    name="password"
                                    onChange={registerForm.handleChange}
                                    value={registerForm.values.password}
                                />
                                {errors.password && <Message message={errors.password} type="error" />}
                            </div>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Confirm Password </p>
                                <input
                                    className="form__input-field"
                                    autoComplete="new-password"
                                    type="password"
                                    minLength={7}
                                    required
                                    name="passwordConfirmation"
                                    onChange={registerForm.handleChange}
                                    value={registerForm.values.passwordConfirmation}
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
