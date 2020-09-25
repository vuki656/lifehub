import styled from "styled-components"

import { Drawer } from "../../ui-kit/components/Drawer"
import { DoneAllIcon } from "../../ui-kit/icons/DoneAllIcon"
import { ExitIcon } from "../../ui-kit/icons/ExitIcon"
import { SettingsIcon as SettingsIconComponent } from "../../ui-kit/icons/SettingsIcon"

export const SideMenuRoot = styled(Drawer)({ justifyContent: 'space-between' })

export const SideMenuTopActions = styled('div')({
    alignItems: 'center',
    display: 'flex',
    flexDirection: "column",
    width: '100%',
})

export const IconLogo = styled('img')({
    padding: "10px 0",
    width: '24px',
})

export const DashboardIcon = styled(DoneAllIcon)((props) => ({ fill: props.theme.palette.grey.main }))

export const SettingsIcon = styled(SettingsIconComponent)((props) => ({ fill: props.theme.palette.grey.main }))

export const LogoutIcon = styled(ExitIcon)((props) => ({ fill: props.theme.palette.grey.main }))
