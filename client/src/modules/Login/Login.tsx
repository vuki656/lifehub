import { useMutation } from '@apollo/react-hooks'
import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/images/logo/TextLogo.svg'
import { ErrorMessage } from '../../components/ErrorMessage'
import { FullScreenTransition } from '../../components/FullScreenTransition'
import { LOGIN_USER } from '../../graphql/user/user'
import { logInUserResponse, logInUserVariables } from '../../graphql/user/user.types'
import { useFormFields } from '../../util/hooks/useFormFields.hook'
import { UserErrors } from '../Register'

export const Login: React.FC<{}> = () => {
    const history = useHistory()

    const [errors, setErrors] = React.useState<UserErrors>({})
    const [logInUserQuery, { loading }] = useMutation<logInUserResponse, logInUserVariables>(LOGIN_USER)
    const [{ email, password }, setFormValue, clearForm] = useFormFields({
        email: '',
        password: '',
    })

    // Log user in
    const handleSubmit = useCallback((event) => {
        event.preventDefault()

        logInUserQuery({
            variables: {
                email,
                password,
            },
        })
        .then((response) => {
            const token = response?.data?.logInUser.token ?? ''
            window.localStorage.setItem('token', token)

            setErrors({})
            clearForm()
            history.push('/dashboard')
        })
        .catch((error) => {
            setErrors(error.graphQLErrors[0]?.extensions)
        })
    }, [logInUserQuery, history, clearForm, email, password])

    return (
        loading
            ? <FullScreenTransition isLoadingActive={loading} />
            : (
                <form onSubmit={handleSubmit}>
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
                                    required
                                    value={email}
                                    onChange={({ target }) => setFormValue(target.value, 'email')}
                                />
                                {errors.email && <ErrorMessage error={errors.email} />}
                            </div>
                            <div className="form__field-wrapper">
                                <p className="form__field-title">Password</p>
                                <input
                                    className="form__input-field"
                                    autoComplete="password"
                                    type="password"
                                    minLength={7}
                                    required
                                    value={password}
                                    onChange={({ target }) => setFormValue(target.value, 'password')}
                                />
                                {errors.password && <ErrorMessage error={errors.password} />}
                            </div>
                            <button className="form__button--wide button button--primary" type="submit">
                                Login
                            </button>
                            <div className="bottom-info">
                                <p className="bottom-info__text">Don't have an account?
                                    <Link to="/" className="bottom-info__link"> Register</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            )
    )
}
