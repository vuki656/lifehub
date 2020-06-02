import React, { ReactElement } from 'react'

// Render given loader given X number of times
export const renderLoaders = (amount: number, loaderComponent: ReactElement): ReactElement[] => {
    return [...new Array(amount)].map((value, index) => React.cloneElement(loaderComponent, { key: index }))
}
