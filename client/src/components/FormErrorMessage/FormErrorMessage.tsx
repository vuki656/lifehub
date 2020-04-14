import Grid from '@material-ui/core/Grid'
import React from 'react'
import { ReactComponent as ErrorTriangle } from '../../assets/images/ErrorTriangle.svg'

import { FormErrorMessageProps } from './FormErrorMessage.types'

export const FormErrorMessage: React.FunctionComponent<FormErrorMessageProps> = (props) => {
    const {
        error = '',
    } = props

    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            className="form__error-wrapper"
        >
            <Grid item>
                <ErrorTriangle className="form__error-icon" />
            </Grid>
            <Grid item className="form__error-text">
                {error}
            </Grid>
        </Grid>
    )
}
