import * as React from 'react'

import {
    TasksCardContextType,
    TasksCardProviderProps,
} from './TasksCardProvider.types'

export const TasksCardContext = React.createContext<TasksCardContextType | null>(null)

export const TasksCardProvider: React.FunctionComponent<TasksCardProviderProps> = (props) => {
    const {
        children,
        refetch,
    } = props

    const value = React.useMemo<TasksCardContextType>(() => {
        return {
            refetch: () => {
                refetch()
            },
        }
    }, [refetch])

    return (
        <TasksCardContext.Provider value={value}>
            {children}
        </TasksCardContext.Provider>
    )
}
