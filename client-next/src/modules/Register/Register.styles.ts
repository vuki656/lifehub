import styled from "styled-components"
import { Panel } from "../../ui-kit/components/Panel"

export const RegisterRoot = styled('div')({
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
})

export const RegisterPanel = styled(Panel)((props) => ({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    rowGap: props.theme.spacing.md,
    width: "380px",
}))

export const RegisterFooterText = styled('div')((props) => ({
    color: props.theme.palette.grey.light100,
    fontSize: '14px',
    margin: 0,
    textAlign: 'center',
}))

export const RegisterFooterLink = styled('a')((props) => ({
    color: props.theme.palette.grey.dark300,
    cursor: "pointer",
    fontWeight: 'bold',
}))
