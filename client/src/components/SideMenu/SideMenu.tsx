import { useRouter } from "next/router"
import * as React from 'react'

import { DrawerIconButton } from "../../ui-kit/components"
import { SideMenuButton } from "../SideMenuButton"

import {
    DashboardIcon,
    IconLogo,
    LogoutIcon,
    SettingsIcon,
    SideMenuRoot,
    SideMenuTopActions,
} from "./SideMenu.styles"

export const SideMenu: React.FunctionComponent = () => {
    const {
        pathname,
        push,
    } = useRouter()

    const handleLogout = () => {
        window.localStorage.removeItem('token',)
        window.localStorage.removeItem('userId',)

        push("/login")
    }

    return (
        <SideMenuRoot variant="mini">
            <SideMenuTopActions>
                <IconLogo src="/images/icon-logo.png" />
                <SideMenuButton
                    component={
                        <DrawerIconButton
                            icon={<DashboardIcon />}
                            selected={pathname?.includes('dashboard')}
                            tooltipText="Dashboard"
                        />
                    }
                    href="/dashboard"
                />
                <SideMenuButton
                    component={
                        <DrawerIconButton
                            icon={<SettingsIcon />}
                            selected={pathname?.includes('settings')}
                            tooltipText="Setting"
                        />
                    }
                    href="/settings"
                />
            </SideMenuTopActions>
            <DrawerIconButton
                icon={<LogoutIcon />}
                onClick={handleLogout}
                tooltipText="Logout"
            />
        </SideMenuRoot>
    )
}
