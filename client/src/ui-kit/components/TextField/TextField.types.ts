import React from 'react'

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    fullWidth?: boolean,
    helperText?: string,
    error?: boolean,
}
