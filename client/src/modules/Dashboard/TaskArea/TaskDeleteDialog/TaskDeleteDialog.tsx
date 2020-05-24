import { useMutation } from '@apollo/react-hooks'
import dayjs from 'dayjs'
import _ from 'lodash'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { RRule, RRuleSet } from 'rrule'

import { ButtonLoadingIconBlue } from '../../../../components/ButtonLoadingIconBlue'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { DELETE_SINGLE_TASK_INSTANCE, GET_TASKS_BY_DATE_AND_TASK_CARD } from '../../../../graphql/task/task'
import { deleteSingleTaskInstanceResponse, deleteSingleTaskInstanceVariables } from '../../../../graphql/task/task.types'
import { TaskDeleteDialogProps } from './TaskDeleteDialog.types'

export const TaskDeleteDialog: React.FC<TaskDeleteDialogProps> = (props) => {
    const {
        isDeleteDialogOpen,
        toggleDeleteDialog,
        deleteTaskAndAllInstances,
        task,
        taskCardId,
        getRrule,
    } = props

    console.log(task)

    const { selectedDate } = useSelector((state) => state.user)
    const [selectedOption, setSelectedOption] = useState('this')
    const [errors, setErrors] = React.useState<{ error?: string }>({})

    const [deleteSingleTaskInstanceMutation, { loading: deleteLoading }] = useMutation<deleteSingleTaskInstanceResponse, deleteSingleTaskInstanceVariables>(DELETE_SINGLE_TASK_INSTANCE)

    const handleDeleteSingleTaskInstance = useCallback(() => {
        const rruleSet: RRuleSet | RRule = getRrule()

        // Check bcz typescript
        if (!('_rrule' in rruleSet)) return

        // Clone the old rrule
        const updatedRruleSet = new RRuleSet()
        updatedRruleSet.rrule(new RRule({
            freq: rruleSet._rrule[0].options.freq,
            interval: rruleSet._rrule[0].options.interval,
            byweekday: rruleSet._rrule[0].options.byweekday,
            dtstart: rruleSet._rrule[0].options.dtstart,
            until: rruleSet._rrule[0].options.until,
        }))

        // Set deleted task date as excluded in rrule so its not created anymore, and add existing ones
        updatedRruleSet.exdate(dayjs.utc(task.date).toDate())
        rruleSet.exdates().forEach((excludedDate) =>
            updatedRruleSet.exdate(excludedDate),
        )

        deleteSingleTaskInstanceMutation({
            variables: {
                input: {
                    taskId: task.id,
                    taskMetaDataId: task.taskMetaData.id,
                    rruleStr: updatedRruleSet.toString(),
                },
            },
            update(cache, response) {
                const { getTasksByDateAndTaskCard }: any = cache.readQuery({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    variables: {
                        input: {
                            taskCardId,
                            selectedDate,
                        },
                    },
                })
                const updatedList = _.filter(getTasksByDateAndTaskCard.tasks, (cachedTask) => (
                    cachedTask.id !== response.data?.deleteSingleTaskInstance.taskId
                ))
                cache.writeQuery({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    data: {
                        getTasksByDateAndTaskCard: {
                            tasks: updatedList,
                            __typename: response.data?.deleteSingleTaskInstance.__typename,
                        },
                    },
                    variables: {
                        input: {
                            taskCardId,
                            selectedDate,
                        },
                    },
                })
            },
        })
        .catch((error) => {
            console.log(error)
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [deleteSingleTaskInstanceMutation, getRrule, task.id, task.date, task.taskMetaData.id])

    const deleteAllTasksAndMetaData = useCallback(() => {

    }, [])

    const handleSubmit = useCallback(() => {
        toggleDeleteDialog()

        switch (selectedOption) {
            case 'this':
                handleDeleteSingleTaskInstance()
                break
            case 'all':
                deleteAllTasksAndMetaData()
                break
        }
    }, [selectedOption, deleteAllTasksAndMetaData, toggleDeleteDialog, handleDeleteSingleTaskInstance])

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
                {errors.error && <ErrorMessage error={errors.error} />}
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
                        {deleteLoading ? <ButtonLoadingIconBlue size={18} /> : 'Ok'}
                    </button>
                </div>
            </div>
        </div>
    )
}
