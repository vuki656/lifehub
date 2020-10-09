import styled, { CSSObject } from "styled-components"

import {
    Checkbox,
    CheckboxProps,
} from "../../../ui-kit/components/Checkbox"
import {
    CheckboxCheckmark,
    CheckboxLabel,
    CheckboxRectangle,
} from "../../../ui-kit/components/Checkbox/Checkbox.styles"

type TaskCheckboxProps = Pick<CheckboxProps, 'checked'>

export const TaskRoot = styled('div')((props) => ({
    "&:hover": { [TaskActions]: { opacity: 1 } },
    borderColor: props.theme.palette.grey.light350,
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    padding: props.theme.spacing.sm,
}))

export const TaskActions = styled('div')((props) => ({
    display: 'flex',
    flexDirection: "row",
    opacity: 0,
    transition: props.theme.transitions.create('opacity', 50),
}))

export const TaskCheckbox = styled(Checkbox)<TaskCheckboxProps>((props) => {
    let styles: CSSObject = {
        [CheckboxCheckmark]: { fill: props.theme.palette.white },
        [CheckboxLabel]: { transition: props.theme.transitions.create('color', 150) },
    }

    if (props.checked) {
        styles = {
            ...styles,
            [CheckboxLabel]: {
                color: props.theme.palette.grey.light350,
                textDecoration: 'line-through',
                // Duplication of this is needed because if only put in initial styles, it is lost on checked state
                // and no animation on un-toggle will be fired.
                transition: props.theme.transitions.create(['color', 'line-through'], 150),
            },
            [CheckboxRectangle]: { backgroundColor: props.theme.palette.grey.light350 },
        }
    }

    return styles
})
