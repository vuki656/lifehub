import { useQuery } from '@apollo/react-hooks'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Route } from 'react-router-dom'

import { VERIFY_USER } from '../../graphql/queries/user.queries'
import {
    VerifyUserQuery,
    VerifyUserQueryVariables,
} from '../../graphql/types'
import { LoadingSpinner } from '../LoadingSpinner'
import { SideMenu } from '../SideMenu'

import { ProtectedRouteProps } from './ProtectedRoute.types'

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = (props) => {
    const {
        exact = false,
        path,
        component,
    } = props

    const dispatch = useDispatch()
    const token = window.localStorage.getItem('token') ?? ''

    // Get token auth status
    const {
        data: verifyUserResponse,
        error,
        loading,
    } = useQuery<VerifyUserQuery, VerifyUserQueryVariables>(
        VERIFY_USER,
        { variables: { token } },
    )

    // If error redirect to login and clear user, else refresh user and proceed
    const checkIfAuth = React.useCallback(() => {
        // if (error) {
        //     dispatch(setUser(''))
        //     window.localStorage.removeItem('token')
        //     return <Redirect to="/login" />
        // }
        //
        // const user = verifyUserResponse?.verifyUser
        // dispatch(setUser(user))

        return (
            <div className="app">
                <SideMenu />
                <Route path={path} component={component} exact={exact} />
            </div>
        )
    }, [path, component, exact, error, dispatch, verifyUserResponse])

    return loading
        ? <LoadingSpinner loaderColor={'blue'} loaderVariant={'fullScreen'} />
        : checkIfAuth()
}

// export default withRouter(RrotectedRoute) // TODO: FIX
export default ProtectedRoute
