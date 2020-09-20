import React from "react"
import styled, { CSSObject } from "styled-components"
import { IconSizeType } from "../../styles"
import { Palette } from "../../styles/palette"

type SvgRootProps =
    React.SVGAttributes<SVGElement>
    & {
    fill: string,
    size: IconSizeType,
}

export const SvgRoot = styled('svg')<SvgRootProps>((props) => {
    const styles: CSSObject = {
        fill: getFill(props.theme.palette, props.fill),
        ...getSize(props.size),
    }

    return styles
})

// eslint-disable-next-line consistent-return
const getFill = (palette: Palette, selectedColor: string) => {
    const {
        red,
        yellow,
        white,
        black,
    } = palette

    switch (selectedColor) {
        case 'red':
            return red
        case "yellow":
            return yellow
        case 'white':
            return white
        case "black":
            return black
        default:
            return white
    }
}

// eslint-disable-next-line consistent-return
const getSize = (size: IconSizeType) => {
    switch (size) {
        case "small":
            return {
                height: '12px',
                width: '12px',
            }
        case "medium":
            return {
                height: '16px',
                width: '16px',
            }
        case "big":
            return {
                height: '18px',
                width: '18px',
            }
        default:
            return {
                height: '14px',
                width: '14px',
            }
    }
}
