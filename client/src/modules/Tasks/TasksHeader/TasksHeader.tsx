import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import * as React from 'react'

import { TasksAddCardDialog } from '../TasksAddCardDialog'

import {
    TasksHeaderRoot,
    TasksHeaderTitle,
} from './TasksHeader.styles'

export const TasksHeader: React.FunctionComponent = () => {
    const { query } = useRouter()

    return (
        <TasksHeaderRoot>
            <TasksHeaderTitle>
                {dayjs(query.selectedDate as string).format('MMM Do YYYY - dddd')}
            </TasksHeaderTitle>
            <TasksAddCardDialog />
        </TasksHeaderRoot>

    )
}
