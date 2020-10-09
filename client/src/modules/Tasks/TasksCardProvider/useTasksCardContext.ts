import * as React from "react"

import { TasksCardContext } from "./TasksCardProvider"
import { TasksCardContextType } from "./TasksCardProvider.types"

export const useTasksCardContext = (): TasksCardContextType => {
    const context = React.useContext(TasksCardContext)

    if (!context) {
        throw new Error(
            'No TasksCardProvider context instance can be found. Please ensure that' +
            'you have called `TasksCardProvider` higher up in your tree.',
        )
    }

    return context
}
