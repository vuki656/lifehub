import React from 'react'

import { DaysList } from './DaysList/DaysList'

export const Dashboard: React.FunctionComponent<{}> = () => {

    return (
        <>
            <DaysList />
            <p>Content</p>
        </>
    )
}
