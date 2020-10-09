import * as React from 'react'

import {
    CheckboxCheckmark,
    CheckboxInput,
    CheckboxLabel,
    CheckboxRectangle,
    CheckboxRoot,
} from "./Checkbox.styles"
import { CheckboxProps } from "./Checkbox.types"

export const Checkbox: React.FunctionComponent<CheckboxProps> = (props) => {
    const {
        checked,
        onChange,
        label,
        className,
        ...other
    } = props

    return (
        <CheckboxRoot className={className}>
            <CheckboxInput
                checked={checked}
                onChange={onChange}
                type="checkbox"
                {...other}
            />
            <CheckboxRectangle checked={checked}>
                <CheckboxCheckmark
                    checked={checked}
                    size="small"
                />
            </CheckboxRectangle>
            {label ? (
                <CheckboxLabel>
                    {label}
                </CheckboxLabel>
            ) : null}
        </CheckboxRoot>
    )
}
