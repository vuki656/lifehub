import React from 'react'
import styled, { CSSObject } from 'styled-components'

type DatePickerRootProps = React.HTMLAttributes<HTMLDivElement> & {
    fullWidth: boolean,
}

export const DatePickerRoot = styled('div')<DatePickerRootProps>((props) => {
    let styles: CSSObject = {
        '.react-datepicker': {
            border: 'none',
            boxShadow: '0 14px 28px #00000040, 0 10px 10px #00000038',
            color: props.theme.palette.black,
        },
        '.react-datepicker__day': {
            '&:hover': { backgroundColor: props.theme.palette.blue.light },
            outline: 'none',
        },
        '.react-datepicker__day--disabled': { color: props.theme.palette.grey.dark },
        '.react-datepicker__day--keyboard-selected': {
            '&:hover': {
                backgroundColor: props.theme.palette.blue.dark,
                transition: props.theme.transitions.create('background-color', 300),
            },
            backgroundColor: props.theme.palette.blue.main,
            color: `${props.theme.palette.white} !important`,
        },
        '.react-datepicker__day--selected': {
            '&:hover': { backgroundColor: props.theme.palette.blue.dark },
            backgroundColor: props.theme.palette.blue.main,
            borderRadius: '5px',
            color: `${props.theme.palette.white} !important`,
            fontWeight: 'bold',
        },
        '.react-datepicker__day--today': {
            borderRadius: '5px',
            color: props.theme.palette.black,
        },
        '.react-datepicker__day-names': { padding: `${props.theme.spacing.sm} 0` },
        '.react-datepicker__header': {
            backgroundColor: props.theme.palette.grey.light450,
            border: 'none',
            paddingBottom: 0,
            paddingLeft: props.theme.spacing.xs,
            paddingRight: props.theme.spacing.xs,
            paddingTop: props.theme.spacing.def,
        },
        '.react-datepicker__input-container input': {
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
        },
        '.react-datepicker__month': {
            margin: 0,
            padding: `${props.theme.spacing.sm} 0 ${props.theme.spacing.xs} 0`,
        },
        '.react-datepicker__navigation--next': {
            borderLeftColor: props.theme.palette.blue.main,
            outline: 'none',
            right: '12px',
            top: '17px',
        },
        '.react-datepicker__navigation--previous': {
            borderRightColor: props.theme.palette.blue.main,
            outline: 'none',
            right: '12px',
            top: '17px',
        },
        '.react-datepicker__triangle': { display: 'none' },
        margin: '10px 0',
    }

    if (props.fullWidth) {
        styles = {
            ...styles,
            '.react-datepicker-wrapper': { width: '100%' },
        }
    }

    return styles
})

export const DatePickerLabel = styled('p')((props) => ({
    ...props.theme.typography.regular,
    fontWeight: 'bold',
    margin: '0 0 5px 0',
}))

