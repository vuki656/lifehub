import { LinkProps } from 'next/link'
import React from 'react'

export type SideMenuButtonProps = LinkProps & {
    href: string,
    component: React.ReactNode
}
