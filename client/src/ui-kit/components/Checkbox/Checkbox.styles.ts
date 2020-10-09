import styled from "styled-components"

import { DoneIcon } from "../../icons/DoneIcon"

import { CheckboxProps } from "./Checkbox.types"

type CheckboxCheckmarkProps = Pick<CheckboxProps, 'checked'>

type CheckboxRectangleProps = Pick<CheckboxProps, 'checked'>

export const CheckboxRoot = styled('label')({
    display: "grid",
    gridTemplateColumns: 'auto 1fr auto',
})

export const CheckboxInput = styled('input')({
    "&:hover": { cursor: "pointer" },
    height: '18px',
    margin: 0,
    opacity: 0,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: '18px',
    zIndex: 1,
})

export const CheckboxRectangle = styled('div')<CheckboxRectangleProps>((props) => ({
    alignItems: 'center',
    backgroundColor: props.theme.palette.white,
    borderColor: props.theme.palette.grey.light350,
    borderRadius: "3px",
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    height: '18px',
    justifyContent: 'center',
    marginRight: props.theme.spacing.xs,
    transition: props.theme.transitions.create('background-color', 125),
    width: '18px',
}))

export const CheckboxCheckmark = styled(DoneIcon)<CheckboxCheckmarkProps>((props) => ({
    fill: props.theme.palette.grey.main,
    opacity: props.checked ? 1 : 0,
    transition: props.theme.transitions.create('opacity', 125),
}))

export const CheckboxLabel = styled('span')({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
})
