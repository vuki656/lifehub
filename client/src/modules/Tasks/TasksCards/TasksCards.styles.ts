import styled from "styled-components"

export const TasksCardsRoot = styled('div')((props) => ({
    alignItems: 'flex-start',
    columnGap: props.theme.spacing.xl,
    display: "grid",
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    overflow: 'auto',
    rowGap: props.theme.spacing.xl,
}))
