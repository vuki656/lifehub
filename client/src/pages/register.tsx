import { NextPage } from 'next'
import NextHead from 'next/head'
import * as React from 'react'

import { Register } from '../modules/Register'

const RegisterPage: NextPage = () => {
    return (
        <>
            <NextHead>
                <title>
                    Lifehub: Register
                </title>
            </NextHead>
            <Register />
        </>
    )
}

export default RegisterPage
