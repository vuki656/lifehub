import { NextPage } from 'next'
import NextHead from 'next/head'
import * as React from 'react'

import { Login } from '../modules/Login'

const HomePage: NextPage = () => {
    return (
        <>
            <NextHead>
                <title>Lifehub: Login</title>
            </NextHead>
            <Login />
        </>
    )
}

export default HomePage