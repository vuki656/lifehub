import styled from "styled-components"

export const TasksRoot = styled('div')({
    display: 'flex',
    flexDirection: "row",
    width: '100%',
})

export const TasksContent = styled('div')((props) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: props.theme.spacing.lg,
    width: '100%',
}))
