import React from "react"
import styled, { CSSObject } from "styled-components"
import { WarningIcon } from "../../icons/WarningIcon"

type TextAreaRootProps =
    React.HTMLAttributes<HTMLDivElement>
    & {
    fullWidth: boolean,
}

export const TextAreaRoot = styled('div')<TextAreaRootProps>((props) => {
    let styles: CSSObject = { margin: '10px 0' }

    if (props.fullWidth) {
        styles = {
            ...styles,
            width: '100%',
        }
    }

    return styles
})

export const TextAreaInput = styled('textarea')((props) => ({
    '&:focus': { boxShadow: `0 0 0 4px ${props.theme.palette.grey.light350}` },
    borderColor: props.theme.palette.grey.light350,
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    outline: 'none',
    padding: props.theme.spacing.def,
    resize: 'none',
    transition: props.theme.transitions.create('box-shadow'),
    width: '100%',
}))

export const TextAreaLabel = styled('p')((props) => ({
    ...props.theme.typography.regular,
    fontWeight: 'bold',
    margin: '0 0 5px 0',
}))

export const TextAreaHelperWrapper = styled('div')({
    alignItems: 'center',
    columnGap: '8px',
    display: 'flex',
    margin: "5px 0 0 0",
    padding: "0 3px",
})

type TextAreaHelperTextProps = React.HTMLAttributes<HTMLParagraphElement> & {
    error: boolean,
}

export const TextAreaHelperText = styled('p')<TextAreaHelperTextProps>((props) => {
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

export const TextAreaErrorIcon = styled(WarningIcon)((props) => ({ fill: props.theme.palette.red }))
