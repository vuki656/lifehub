import { useMutation } from '@apollo/react-hooks'
import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/images/logo/TextLogo.svg'
import { FormErrorMessage } from '../../components/FormErrorMessage'
import { FullScreenTransition } from '../../components/FullScreenTransition'
import { CREATE_USER } from '../../graphql/user/user'
import { createUserResponse, createUserVariables } from '../../graphql/user/user.types'
import { useFormFields } from '../../util/hooks/useFormFields.hook'
import { UserErrors } from './Register.types'

export const Register: React.FC<{}> = () => {
    const history = useHistory()

    const [errors, setErrors] = React.useState<UserErrors>({})
    const [createUserMutation, { loading }] = useMutation<createUserResponse, createUserVariables>(CREATE_USER)
    const [{ username, email, password, passwordConfirmation }, setFormValue, clearForm] = useFormFields({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    })

    // Save user in database
    const handleSubmit = useCallback((event) => {
        event.preventDefault()

        createUserMutation({
            variables: { username, email, password, passwordConfirmation },
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
    }, [createUserMutation, history, clearForm, username, email, password, passwordConfirmation])

    return (
        loading
            ? <FullScreenTransition isLoadingActive={loading} />
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
                                    name="username"
                                    value={username}
                                    onChange={setFormValue}
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
                                    name="email"
                                    value={email}
                                    onChange={setFormValue}
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
                                    name="password"
                                    value={password}
                                    onChange={setFormValue}
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
                                    name="passwordConfirmation"
                                    value={passwordConfirmation}
                                    onChange={setFormValue}
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
