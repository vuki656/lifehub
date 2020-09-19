import styled, { keyframes } from 'styled-components'

import { Panel } from '../../ui-kit/components/Panel'

export const LoginRoot = styled('div')({
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
})

export const LoginPanel = styled(Panel)((props) => ({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    rowGap: props.theme.spacing.md,
}))

const rotateAnimation = keyframes({ '100%': { transform: 'rotate(360deg)' } })

export const Loader = styled.div`
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 100%;
    width: 17px;
    height: 17px;
    animation: ${rotateAnimation} 1.5s linear infinite;
`
