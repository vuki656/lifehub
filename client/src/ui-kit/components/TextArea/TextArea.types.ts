import React from 'react'

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    fullWidth?: boolean,
    label?: string,
    helperText?: string,
    error?: boolean,
}
