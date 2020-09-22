import React from "react"
import styled from "styled-components"

type DrawerIconButtonRootProps =
    React.HTMLAttributes<HTMLDivElement>
    & {
    selected: boolean,
}

export const DrawerIconButtonRoot = styled('div')<DrawerIconButtonRootProps>((props) => ({
    "&:hover": {
        backgroundColor: props.theme.palette.grey.dark,
        transition: props.theme.transitions.create('background-color', 300),
    },
    alignItems: 'center',
    backgroundColor: props.selected ?
        props.theme.palette.grey.dark :
        "",
    cursor: 'pointer',
    display: 'flex',
    height: '40px',
    justifyContent: 'center',
    width: '100%',
}))
