import * as React from 'react'

import {
    TasksContent,
    TasksRoot,
} from "./Tasks.styles"
import { TasksCards } from "./TasksCards"
import { TasksDayList } from "./TasksDayList"
import { TasksHeader } from "./TasksHeader"

export const Tasks: React.FunctionComponent = () => {
    return (
        <TasksRoot>
            <TasksDayList />
            <TasksContent>
                <TasksHeader />
                <TasksCards />
            </TasksContent>
        </TasksRoot>
    )
}
