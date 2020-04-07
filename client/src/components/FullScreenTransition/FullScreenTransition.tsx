import Grid from '@material-ui/core/Grid'
import React from 'react'
import Lottie from 'react-lottie'
import animationData from '../../assets/images/lottie/loading-circle.json'
import { FullScreenTransitionProps } from './FullScreenTransition.types'

export const FullScreenTransition: React.FunctionComponent<FullScreenTransitionProps> = (props) => {
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
        <Grid
            className="full-screen-transition"
            alignItems="center"
            justify="center"
            container
        >
            <Lottie
                options={defaultOptions}
                height={100}
                width={100}
                isStopped={!isLoadingActive}
            />
        </Grid>
    )
}
