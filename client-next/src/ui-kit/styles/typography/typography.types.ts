import type {
    FontStyleProperty,
    FontWeightAbsolute,
} from 'csstype'

export type TypographyStyle = {
    fontWeight: FontWeightAbsolute,
    fontStyle: FontStyleProperty,
    fontSize: string | number,
    lineHeight: string | number,
}

export type TypographyVariant =
    | 'helper'
    | 'regular'
    | 'title'

export type Typography =
    {
        fontFamily: {
            primary: string,
            secondary: string,
        },
    }
    & Record<TypographyVariant, TypographyStyle>
