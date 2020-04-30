import { useQuery } from '@apollo/react-hooks'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Redirect, Route, withRouter } from 'react-router-dom'

import { VERIFY_USER } from '../../graphql/user/user'
import { verifyUserResponse, verifyUserVariables } from '../../graphql/user/user.types'
import { setUser } from '../../redux/actions/userActions'
import { FullScreenTransition } from '../FullScreenTransition'
import SideMenu from '../SideMenu/SideMenu'
import { ProtectedRouteProps } from './ProtectedRoute.types'

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
    const {
        exact = false,
        path,
        component,
    } = props

    const dispatch = useDispatch()

    // Get token auth status
    const { data, error, loading } = useQuery<verifyUserResponse, verifyUserVariables>(VERIFY_USER, {
        variables: {
            token: window.localStorage.getItem('token') ?? '',
        },
    })

    // If error redirect to login and clear user, else refresh user and proceed
    const checkIfAuth = React.useCallback(() => {
        if (error) {
            dispatch(setUser(''))
            window.localStorage.removeItem('token')
            return <Redirect to="/login" />
        } else {
            dispatch(setUser(data?.verifyUser?.username))

            return (
                <div className="app">
                    <SideMenu />
                    <Route path={path} component={component} exact={exact} />
                </div>
            )
        }
    }, [path, component, exact, error, dispatch, data])

    return loading
        ? <FullScreenTransition isLoadingActive={loading} />
        : checkIfAuth()
}

export default withRouter(ProtectedRoute)
