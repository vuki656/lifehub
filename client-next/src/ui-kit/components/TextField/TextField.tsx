import React from 'react'

import {
    TextFieldInput,
    TextFieldLabel,
} from './TextField.styles'
import { TextFieldProps } from './TextField.types'

export const TextField: React.FunctionComponent<TextFieldProps> = (props) => {
    const {
        onChange: onChangeProp,
        label,
        ...other
    } = props

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        onChangeProp?.(event)
    }

    return (
        <div>
            <TextFieldLabel>{label}</TextFieldLabel>
            <TextFieldInput
                {...other}
                onChange={onChange}
            />
        </div>
    )
}
