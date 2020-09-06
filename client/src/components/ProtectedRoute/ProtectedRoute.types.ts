import React from 'react'

export type ProtectedRouteProps = {
    exact?: boolean,
    path: string,
    component: React.FunctionComponent,
}
