import React from "react"
import styled, { CSSObject } from 'styled-components'

type TextFieldRootProps =
    React.HTMLAttributes<HTMLDivElement>
    & {
    fullWidth: boolean,
}

export const TextFieldRoot = styled('div')<TextFieldRootProps>((props) => {
    let styles: CSSObject = { margin: '10px 0' }

    if (props.fullWidth) {
        styles = {
            ...styles,
            width: '100%',
        }
    }

    return styles
})

export const TextFieldLabel = styled('p')((props) => ({
    ...props.theme.typography.regular,
    fontWeight: 'bold',
    margin: '0 0 5px 0',
}))

export const TextFieldInput = styled('input')((props) => ({
    '&:focus': { boxShadow: `0 0 0 4px ${props.theme.palette.grey.dark}` },
    borderColor: props.theme.palette.grey.main,
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    outline: 'none',
    padding: props.theme.spacing.def,
    transition: props.theme.transitions.create('box-shadow'),
    width: '100%',
}))

export const TextFieldHelperWrapper = styled('div')({
    alignItems: 'center',
    columnGap: '8px',
    display: 'flex',
    margin: "5px 0 0 0",
    padding: "0 3px",
})

type TextFieldHelperTextProps = {
    error: boolean,
}

export const TextFieldHelperText = styled('p')<TextFieldHelperTextProps>((props) => {
    let styles: CSSObject = {
        ...props.theme.typography.helper,
        color: props.theme.palette.grey.darker,
        fontWeight: 500,
        margin: '0',
    }

    if (props.error) {
        styles = {
            ...styles,
            color: props.theme.palette.red,
        }
    }

    return styles
})
