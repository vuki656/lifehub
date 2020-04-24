import React from 'react'

import { DaysList } from './DaysList/DaysList'

export const Dashboard: React.FC<{}> = () => {
    return (
        <>
            <DaysList />
            <p>Content</p>
        </>
    )
}
