import styled from "styled-components"

import {
    IconButton,
    Panel,
} from "../../../ui-kit/components"

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

export const TasksCardHeader = styled('div')((props) => ({
    display: "flex",
    flexDirection: 'row',
    justifyContent: "space-between",
    paddingBottom: props.theme.spacing.md,
}))

export const TasksCardTitle = styled('p')((props) => ({ ...props.theme.typography.subtitle }))

export const TasksCardForm = styled('form')({
    display: 'flex',
    flexDirection: 'row',
})

export const SubmitButton = styled(IconButton)({
    margin: '10px 0 10px 10px',
    paddingLeft: '5px',
    paddingRight: '5px',
})
