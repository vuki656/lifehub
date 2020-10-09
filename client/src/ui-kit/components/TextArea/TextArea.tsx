import * as React from 'react'

import {
    TextAreaErrorIcon,
    TextAreaHelperText,
    TextAreaHelperWrapper,
    TextAreaInput,
    TextAreaLabel,
    TextAreaRoot,
} from "./TextArea.styles"
import { TextAreaProps } from "./TextArea.types"

export const TextArea: React.FunctionComponent<TextAreaProps> = (props) => {
    const {
        fullWidth = false,
        label,
        helperText,
        error = false,
        ...other
    } = props

    return (
        <TextAreaRoot fullWidth={fullWidth}>
            {label ? (
                <TextAreaLabel>
                    {label}
                </TextAreaLabel>
            ) : null}
            <TextAreaInput
                {...other}
            />
            {helperText ? (
                <TextAreaHelperWrapper>
                    {error
                        ? <TextAreaErrorIcon size="small" />
                        : null
                    }
                    <TextAreaHelperText error={error}>
                        {helperText}
                    </TextAreaHelperText>
                </TextAreaHelperWrapper>
            ) : null}
        </TextAreaRoot>
    )
}
