import React from 'react'
import Lottie from 'react-lottie'

import animationData from '../../assets/images/lottie/loading-circle-blue.json'
import { ButtonLoadingIconBlueProps } from './ButtonLoadingIconBlueProps.types'

export const ButtonLoadingIconBlue: React.FC<ButtonLoadingIconBlueProps> = (props) => {
    const { size } = props

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData.default,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    }

    return (
        <div className="button-transition">
            <Lottie
                height={size}
                width={size}
                options={defaultOptions}
                isStopped={true}
            />
        </div>
    )
}
