import styled from "styled-components"

export const RemindersRoot = styled('div')((props) => ({
    backgroundColor: props.theme.palette.white,
    boxShadow: `0 2px 10px 0 ${props.theme.palette.grey.dark}`,
    padding: props.theme.spacing.lg,
    width: '300px',
}))

export const RemindersHeader = styled('div')({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

export const RemindersTitle = styled('p')((props) => ({
    ...props.theme.typography.title,
    margin: 0,
}))

