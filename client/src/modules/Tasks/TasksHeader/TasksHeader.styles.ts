import styled from 'styled-components'

export const TasksHeaderRoot = styled('div')({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
})

export const TasksHeaderTitle = styled('p')((props) => ({ ...props.theme.typography.title }))
