import * as React from 'react'
import { WarningIcon } from "../../icons/WarningIcon"
import {
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
            <TextAreaLabel>
                {label}
            </TextAreaLabel>
            <TextAreaInput
                {...other}
            />
            {helperText ? (
                <TextAreaHelperWrapper>
                    {error ? (
                        <WarningIcon
                            color="red"
                            size="small"
                        />
                    ) : null}
                    <TextAreaHelperText error={error}>
                        {helperText}
                    </TextAreaHelperText>
                </TextAreaHelperWrapper>
            ) : null}
        </TextAreaRoot>
    )
}
