import { NextPage } from 'next'
import NextHead from 'next/head'
import * as React from 'react'
import { Settings } from "../modules/Settings"

const SettingsPage: NextPage = () => {
    return (
        <>
            <NextHead>
                <title>
                    Lifehub: Dashboard
                </title>
            </NextHead>
            <Settings />
        </>
    )
}

export default SettingsPage
