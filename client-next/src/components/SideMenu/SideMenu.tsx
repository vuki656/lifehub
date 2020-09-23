import { useRouter } from "next/router"
import * as React from 'react'
import { DrawerIconButton } from "../../ui-kit/components"
import {
    DoneAllIcon,
    ExitIcon,
    SettingsIcon,
} from "../../ui-kit/icons"
import { SideMenuButton } from "../SideMenuButton"
import {
    IconLogo,
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
                            icon={<DoneAllIcon color="black" />}
                            selected={pathname?.includes('dashboard')}
                            tooltipText="Dashboard"
                        />
                    }
                    href="/dashboard"
                >
                </SideMenuButton>
                <SideMenuButton
                    component={
                        <DrawerIconButton
                            icon={<SettingsIcon color="black" />}
                            selected={pathname?.includes('settings')}
                            tooltipText="Setting"
                        />
                    }
                    href="/settings"
                >
                </SideMenuButton>
            </SideMenuTopActions>
            <DrawerIconButton
                icon={<ExitIcon color="black" />}
                onClick={handleLogout}
                tooltipText="Logout"
            />
        </SideMenuRoot>
    )
}
