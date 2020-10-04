import styled from "styled-components"

import { Panel } from "../../../ui-kit/components"

export const TasksCardActions = styled('div')({
    alignItems: 'center',
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'center',
})

export const TasksCardRoot = styled(Panel)((props) => ({
    "&:hover": {
        [TasksCardActions]: {
            opacity: 1,
            transition: props.theme.transitions.create('opacity', 300),
        },
    },
    [TasksCardActions]: { opacity: 0 },
    borderRadius: '5px',
}))

export const TasksCardHeader = styled('div')({
    display: "flex",
    flexDirection: 'row',
    justifyContent: "space-between",
})

export const TasksCardTitle = styled('p')((props) => ({ ...props.theme.typography.subtitle }))

