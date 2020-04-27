import React from 'react'
import Lottie from 'react-lottie'

import animationData from '../../assets/images/lottie/loading-circle-white.json'
import { ButtonLoadingProps } from './ButtonLoading.types'

export const ButtonLoading: React.FC<ButtonLoadingProps> = (props) => {
    const { isLoadingActive } = props

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
                height={18}
                width={18}
                options={defaultOptions}
                isStopped={!isLoadingActive}
            />
        </div>
    )
}
