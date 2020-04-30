import React from 'react'

import { ReactComponent as ErrorTriangle } from '../../assets/images/ErrorTriangle.svg'
import { ErrorMessageProps } from './ErrorMessage.types'

export const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
    const {
        error = '',
    } = props

    return (
        <div className="form__error-wrapper">
            <ErrorTriangle className="form__error-icon" />
            <p className="form__error-text">{error}</p>
        </div>
    )
}
