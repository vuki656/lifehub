import React, { useCallback, useEffect, useState } from 'react'

import { LoadingSpinnerProps, VariantType } from './LoadingSpinner.types'

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => {
    const { loaderVariant, loaderColor } = props

    const [color, setColor] = useState<string>('')
    const [variant, setVariant] = useState<VariantType>({
        size: '18px',
        spinnerWidth: '2px',
    })

    const setInitialVariant = useCallback(() => {
        switch (loaderVariant) {
            case('button'):
                setVariant({
                    size: '18px',
                    spinnerWidth: '2px',
                    minHeight: 'inherit',
                })
                break
            case('fullScreen'):
                setVariant({
                    size: '70px',
                    spinnerWidth: '6px',
                    minHeight: '100vh',
                })
                break
        }
    }, [loaderVariant])

    const setInitialColor = useCallback(() => {
        switch (loaderColor) {
            case('blue'):
                setColor('#0083ff')
                break
            case('white'):
                setColor('#ffffff')
                break
        }
    }, [loaderColor])

    useEffect(() => {
        setInitialColor()
        setInitialVariant()
    }, [setInitialColor, setInitialVariant])

    return (
        <div
            className="loader-wrapper"
            style={{ minHeight: variant.minHeight }}
        >
            <div
                className="loader"
                style={{
                    height: variant.size,
                    width: variant.size,
                    borderWidth: variant.spinnerWidth,
                    borderTopColor: color,
                }} />
        </div>
    )
}
