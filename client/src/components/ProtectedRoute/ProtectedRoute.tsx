import { useQuery } from '@apollo/react-hooks'
import React from 'react'
import { Redirect, Route, withRouter } from 'react-router-dom'

import { VERIFY_USER } from '../../graphql/user/user'
import { verifyUserResponse, verifyUserVariables } from '../../graphql/user/user.types'
import { FullScreenTransition } from '../FullScreenTransition'
import { ProtectedRouteProps } from './ProtectedRoute.types'

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
    const {
        exact = false,
        path,
        component,
    } = props

    // Get token auth status
    const { data, error, loading } = useQuery<verifyUserResponse, verifyUserVariables>(VERIFY_USER, {
        variables: {
            token: window.localStorage.getItem('token') ?? '',
        },
    })

    // Check if there are errors after loading finished, if yes redirect to login, otherwise proceed
    const checkIfAuth = React.useCallback(() => {
        return error
            ? <Redirect to="/login" />
            : <Route path={path} component={component} exact={exact} />
    }, [path, component, exact, error])

    return loading
        ? <FullScreenTransition isLoadingActive={loading} />
        : checkIfAuth()
}

export default withRouter(ProtectedRoute)
