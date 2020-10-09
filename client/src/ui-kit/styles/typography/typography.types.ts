import * as CSS from 'csstype'

export type TypographyStyle = {
    fontWeight: CSS.Property.FontWeight,
    fontStyle: CSS.Property.FontStyle,
    fontSize: string | number,
    lineHeight: string | number,
}

export type TypographyVariant =
    | 'helper'
    | 'regular'
    | 'title'
    | 'subtitle'

export type Typography =
    {
        fontFamily: {
            primary: string,
            secondary: string,
        },
    }
    & Record<TypographyVariant, TypographyStyle>
