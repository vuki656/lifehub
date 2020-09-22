import styled from "styled-components"
import { Drawer } from "../../ui-kit/components/Drawer"

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
