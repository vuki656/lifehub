import styled from 'styled-components'

export const RemindersRoot = styled('div')((props) => ({
    backgroundColor: props.theme.palette.white,
    boxShadow: `0 2px 10px 0 ${props.theme.palette.grey.light300}`,
    minWidth: '350px',
    overflow: 'hidden',
    padding: props.theme.spacing.lg,
    width: '350px',
}))

export const RemindersHeader = styled('div')((props) => ({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: props.theme.spacing.def,
}))

export const RemindersTitle = styled('p')((props) => ({
    ...props.theme.typography.title,
    margin: 0,
}))

export const RemindersContent = styled('div')((props) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'auto',
    paddingBottom: props.theme.spacing.def,
    paddingTop: props.theme.spacing.def,
}))
