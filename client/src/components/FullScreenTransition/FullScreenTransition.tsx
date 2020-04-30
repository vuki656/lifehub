import React from 'react'
import Lottie from 'react-lottie'

import animationData from '../../assets/images/lottie/loading-circle-blue.json'
import { FullScreenTransitionProps } from './FullScreenTransition.types'

export const FullScreenTransition: React.FC<FullScreenTransitionProps> = (props) => {
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
        <div className="full-screen-transition">
            <Lottie
                options={defaultOptions}
                height={100}
                width={100}
                isStopped={!isLoadingActive}
            />
        </div>
    )
}
