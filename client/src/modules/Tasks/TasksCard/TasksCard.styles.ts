import React from 'react'
import styled from 'styled-components'

import {
    IconButton,
    Panel,
} from '../../../ui-kit/components'

type TasksCardTasksProps = React.HTMLAttributes<HTMLDivElement>

export const TasksCardActions = styled('div')((props) => ({
    alignItems: 'center',
    columnGap: props.theme.spacing.xs,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
}))

export const TasksCardRoot = styled(Panel)((props) => ({
    '&:hover': {
        [TasksCardActions]: {
            opacity: 1,
            transition: props.theme.transitions.create('opacity', 300),
        },
    },
    [TasksCardActions]: { opacity: 0 },
    borderRadius: '5px',
}))

export const TasksCardHeader = styled('div')((props) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: props.theme.spacing.md,
}))

export const TasksCardTitle = styled('p')((props) => ({
    ...props.theme.typography.subtitle,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}))

export const TasksCardForm = styled('form')({
    display: 'flex',
    flexDirection: 'row',
})

export const SubmitButton = styled(IconButton)({
    margin: '10px 0 10px 10px',
    paddingLeft: '10px',
    paddingRight: '10px',
})

export const TasksCardTasks = styled('div')<TasksCardTasksProps>((props) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: props.theme.spacing.xs,
}))
