import styled from 'styled-components'

export const DialogActionsRoot = styled('div')((props) => ({
    columnGap: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: props.theme.spacing.md,
}))
