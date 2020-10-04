import styled from "styled-components"

export const TasksCardsRoot = styled('div')((props) => ({
    columnGap: props.theme.spacing.xl,
    display: "grid",
    gridTemplateColumns: '1fr 1fr',
    rowGap: props.theme.spacing.xl,
}))
