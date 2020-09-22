import React from "react"
import styled, { CSSObject } from "styled-components"
import { DrawerVariantType } from "../../styles"

type DrawerRootProps = React.HTMLAttributes<HTMLDivElement> & {
    variant: DrawerVariantType
}


export const DrawerRoot = styled('div')<DrawerRootProps>((props) => {
    let styles: CSSObject = {
        backgroundColor: props.theme.palette.white,
        boxShadow: `0 2px 10px 0 ${props.theme.palette.grey.dark}`,
        display: 'flex',
        flexDirection: "column",
        height: '100%',
    }

    if (props.variant === "mini") {
        styles = {
            ...styles,
            maxWidth: '50px',
            width: '50px',
        }
    }

    return styles
})
