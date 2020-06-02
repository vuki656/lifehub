import { useMutation } from '@apollo/react-hooks'
import dayjs from 'dayjs'
import _ from 'lodash'
import React, {
    useCallback,
    useState,
} from 'react'
import { useSelector } from 'react-redux'
import {
    RRule,
    RRuleSet,
} from 'rrule'

import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { Message } from '../../../../components/Message'
import {
    DELETE_ALL_TASKS_AND_META_DATA,
    DELETE_SINGLE_TASK_INSTANCE,
    GET_TASKS_BY_DATE_AND_TASK_CARD,
} from '../../../../graphql/task/task'
import {
    deleteAllTasksAndMetaDataResponse,
    deleteAllTasksAndMetaDataVariables,
    deleteSingleTaskInstanceResponse,
    deleteSingleTaskInstanceVariables,
    getTasksByDateAndTaskCardResponse,
} from '../../../../graphql/task/task.types'

import { TaskDeleteDialogProps } from './TaskDeleteDialog.types'

export const TaskDeleteDialog: React.FC<TaskDeleteDialogProps> = (props) => {
    const {
        isDeleteDialogOpen,
        toggleDeleteDialog,
        task,
        taskCardId,
        getRrule,
    } = props

    const { selectedDate } = useSelector((state) => state.user)
    const [selectedOption, setSelectedOption] = useState('this')
    const [errors, setErrors] = React.useState<{ error?: string }>({})

    const [
        deleteSingleTaskInstanceMutation,
        { loading: deleteSingleLoading },
    ] = useMutation<deleteSingleTaskInstanceResponse, deleteSingleTaskInstanceVariables>(DELETE_SINGLE_TASK_INSTANCE)
    const [
        deleteAllTasksAndMetaDataMutation,
        { loading: deleteAllLoading },
    ] = useMutation<deleteAllTasksAndMetaDataResponse, deleteAllTasksAndMetaDataVariables>(DELETE_ALL_TASKS_AND_META_DATA)

    // Delete single task instance and add it as excluded in metadata rrule
    const handleDeleteSingleTaskInstance = useCallback(() => {
        const rruleSet: RRuleSet | RRule = getRrule()

        // Check bcz typescript
        if (!('_rrule' in rruleSet)) return

        // Clone the old rrule
        const updatedRruleSet = new RRuleSet()
        updatedRruleSet.rrule(new RRule({
            byweekday: rruleSet._rrule[0].options.byweekday,
            dtstart: rruleSet._rrule[0].options.dtstart,
            freq: rruleSet._rrule[0].options.freq,
            interval: rruleSet._rrule[0].options.interval,
            until: rruleSet._rrule[0].options.until,
        }))

        // Set deleted task date as excluded in rrule so its not created anymore, and add existing ones
        updatedRruleSet.exdate(dayjs.utc(task.date).toDate())
        rruleSet.exdates().forEach((excludedDate) =>
            updatedRruleSet.exdate(excludedDate),
        )

        deleteSingleTaskInstanceMutation({
            update(cache, response) {
                const localCache = cache.readQuery<getTasksByDateAndTaskCardResponse>({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    variables: {
                        input: {
                            selectedDate,
                            taskCardId,
                        },
                    },
                })
                const updatedList = _.filter(localCache?.getTasksByDateAndTaskCard.tasks, (cachedTask) => (
                    cachedTask.id !== response.data?.deleteSingleTaskInstance.taskId
                ))
                cache.writeQuery<getTasksByDateAndTaskCardResponse>({
                    data: {
                        getTasksByDateAndTaskCard: {
                            __typename: response.data?.deleteSingleTaskInstance.__typename!,
                            tasks: updatedList,
                        },
                    },
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    variables: {
                        input: {
                            selectedDate,
                            taskCardId,
                        },
                    },
                })
            },
            variables: {
                input: {
                    rruleStr: updatedRruleSet.toString(),
                    taskId: task.id,
                    taskMetaDataId: task.taskMetaData.id,
                },
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        deleteSingleTaskInstanceMutation,
        getRrule,
        selectedDate,
        taskCardId,
        task.id,
        task.date,
        task.taskMetaData.id,
    ])

    // Delete all tasks and their corresponding meta data
    const deleteAllTasksAndMetaData = useCallback(() => {
        deleteAllTasksAndMetaDataMutation({
            update(cache, response) {
                const { getTasksByDateAndTaskCard }: any = cache.readQuery({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    variables: {
                        input: {
                            selectedDate,
                            taskCardId,
                        },
                    },
                })
                cache.writeQuery({
                    data: {
                        getTasksByDateAndTaskCard: {
                            __typename: response.data?.deleteAllTasksAndMetaData.__typename,
                            tasks: _.remove(getTasksByDateAndTaskCard, task),
                        },
                    },
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    variables: {
                        input: {
                            selectedDate,
                            taskCardId,
                        },
                    },
                })
            },
            variables: { input: { taskMetaDataId: task.taskMetaData.id } },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        deleteAllTasksAndMetaDataMutation,
        selectedDate,
        task,
        taskCardId,
    ])

    const handleSubmit = useCallback(() => {
        toggleDeleteDialog()

        if (!deleteSingleLoading || !deleteAllLoading) {
            switch (selectedOption) {
                case 'this':
                    handleDeleteSingleTaskInstance()
                    break
                case 'all':
                    deleteAllTasksAndMetaData()
                    break
            }
        }
    }, [
        selectedOption,
        deleteAllTasksAndMetaData,
        toggleDeleteDialog,
        handleDeleteSingleTaskInstance,
        deleteSingleLoading,
        deleteAllLoading,
    ])

    return (
        <div className={'dialog ' + (isDeleteDialogOpen ? 'dialog--open' : 'dialog--closed')}>
            <div className="dialog__content">
                <div className="dialog__header-wrapper">
                    <p className="title">
                        <span role="img" aria-label="trash">🗑</span>️
                        Delete Task
                    </p>
                </div>
                <div
                    className="dialog__radio form__field-wrapper"
                    onClick={() => setSelectedOption('this')}
                >
                    <input
                        className="this"
                        onChange={() => setSelectedOption('this')}
                        value="this"
                        checked={selectedOption === 'this'}
                        type="radio"
                    />
                    <label
                        htmlFor="this"
                        className="dialog__radio-text"
                    >
                        This Task
                    </label>
                </div>
                <div
                    className="dialog__radio form__field-wrapper"
                    onClick={() => setSelectedOption('all')}
                >
                    <input
                        className="all"
                        onChange={() => setSelectedOption('all')}
                        value="all"
                        checked={selectedOption === 'all'}
                        type="radio"
                    />
                    <label
                        htmlFor="all"
                        className="dialog__radio-text"
                    >
                        All Tasks
                    </label>
                </div>
                {errors.error && <Message message={errors.error} type="error" />}
                <div className="form__button-group--right">
                    <button
                        onClick={toggleDeleteDialog}
                        className="button button--secondary button-delete"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="button button--primary button-delete"
                        type="button"
                    >
                        {deleteSingleLoading || deleteAllLoading
                            ? <LoadingSpinner loaderColor={'white'} loaderVariant={'button'} />
                            : 'Ok'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}
