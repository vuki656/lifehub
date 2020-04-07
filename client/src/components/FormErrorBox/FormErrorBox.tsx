import Grid from '@material-ui/core/Grid'
import React from 'react'
import { ReactComponent as ErrorTriangle } from '../../assets/images/ErrorTriangle.svg'

import { FormErrorBoxProps } from './FormErrorBox.types'

export const FormErrorBox: React.FunctionComponent<FormErrorBoxProps> = (props) => {
    const {
        error = '',
    } = props

    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            className="register-form__error-wrapper"
        >
            <Grid item>
                <ErrorTriangle className="register-form__error-icon" />
            </Grid>
            <Grid item className="register-form__error-text">
                {error}
            </Grid>
        </Grid>
    )
}
