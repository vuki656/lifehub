import React from 'react'
import { WarningIcon } from "../../icons/WarningIcon"

import {
    TextFieldHelperText,
    TextFieldHelperWrapper,
    TextFieldInput,
    TextFieldLabel,
    TextFieldRoot,
} from './TextField.styles'
import { TextFieldProps } from './TextField.types'

export const TextField: React.FunctionComponent<TextFieldProps> = (props) => {
    const {
        onChange: onChangeProp,
        fullWidth = false,
        label,
        helperText,
        error = false,
        ...other
    } = props

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        onChangeProp?.(event)
    }

    return (
        <TextFieldRoot fullWidth={fullWidth}>
            <TextFieldLabel>
                {label}
            </TextFieldLabel>
            <TextFieldInput
                {...other}
                onChange={onChange}
            />
            {helperText ?
                (
                    <TextFieldHelperWrapper>
                        {error ? (
                            <WarningIcon
                                color="red"
                                size="small"
                            />
                        ) : null}
                        <TextFieldHelperText error={error}>
                            {helperText}
                        </TextFieldHelperText>
                    </TextFieldHelperWrapper>
                ) :
                null}
        </TextFieldRoot>
    )
}
