import React, { ReactElement } from 'react'

export const renderLoaders = (amount: number, loaderComponent: ReactElement) => {
    return [...new Array(amount)].map((value, index) => React.cloneElement(loaderComponent, { key: index }))
}
