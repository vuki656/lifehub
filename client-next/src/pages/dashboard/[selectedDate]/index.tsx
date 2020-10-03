import { NextPage } from 'next'
import NextHead from 'next/head'
import * as React from 'react'

import { Dashboard } from "../../../modules/Dashboard"

const SelectedDayPage: NextPage = () => {
    return (
        <>
            <NextHead>
                <title>
                    Lifehub: Dashboard
                </title>
            </NextHead>
            <Dashboard />
        </>
    )
}

export default SelectedDayPage
