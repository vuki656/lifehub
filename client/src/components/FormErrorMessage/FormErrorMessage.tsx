import React from 'react'

import { ReactComponent as ErrorTriangle } from '../../assets/images/ErrorTriangle.svg'
import { FormErrorMessageProps } from './FormErrorMessage.types'

export const FormErrorMessage: React.FC<FormErrorMessageProps> = (props) => {
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
