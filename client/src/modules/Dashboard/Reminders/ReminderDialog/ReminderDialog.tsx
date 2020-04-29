import { useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'

import { ButtonLoadingIcon } from '../../../../components/ButtonLoadingIcon'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { CREATE_REMINDER, DELETE_REMINDER, UPDATE_REMINDER } from '../../../../graphql/reminder/reminder'
import {
    createReminderResponse,
    createReminderVariables,
    deleteReminderResponse,
    deleteReminderVariables,
    updateReminderResponse,
    updateReminderVariables,
} from '../../../../graphql/reminder/reminder.types'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { ReminderErrors } from '../Reminder.types'
import { ReminderDialogProps } from './ReminderDialog.types'

export const ReminderDialog: React.FC<ReminderDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, reminder } = props

    const username = useSelector((state) => state.user.username)
    const [createReminderMutation, { loading: createLoading }] = useMutation<createReminderResponse, createReminderVariables>(CREATE_REMINDER)
    const [updateReminderMutation, { loading: updateLoading }] = useMutation<updateReminderResponse, updateReminderVariables>(UPDATE_REMINDER)
    const [deleteReminderMutation, { loading: deleteLoading }] = useMutation<deleteReminderResponse, deleteReminderVariables>(DELETE_REMINDER)

    // Form
    const [errors, setErrors] = React.useState<ReminderErrors>({})
    const [startDate, setStartDate] = useState<Date | undefined>(reminder ? new Date(reminder.startDate / 1) : undefined) // No idea why 1 is needed, crashes with it
    const [endDate, setEndDate] = useState<Date | undefined>(reminder ? new Date(reminder.endDate / 1) : undefined)
    const [{ title, description }, setFormValue] = useFormFields({
        title: reminder ? reminder.title : '',
        description: reminder?.description ? reminder.description : '',
    })

    // Cancel reminder creation, clear form, close dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        setErrors({})
    }, [toggleDialog])

    // Save reminder
    const saveReminder = useCallback(() => {
        createReminderMutation({
            variables: {
                username,
                title,
                description,
                startDate: moment.utc(startDate).format()!,
                endDate: moment.utc(endDate).format()!,
            },
            // TODO READ QUERY ACCEPTS VARIABLES
            // update(cache) {
            //     const localCache: any = cache.readQuery({ query: PRODUCTS })
            //     const updateProductsList = localCache.products.filter((_product) => _product.id !== id)
            //     cache.writeQuery({
            //         query: PRODUCTS,
            //         data: { products: updateProductsList },
            //     })
            // },
        })
        .then(() => handleDialogToggle())
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [createReminderMutation, username, endDate, startDate, title, description, handleDialogToggle])

    // Update reminder
    const updateReminder = useCallback(() => {
        updateReminderMutation({
            variables: {
                id: reminder?.id!,
                username,
                title,
                description,
                startDate: moment.utc(startDate).format()!,
                endDate: moment.utc(endDate).format()!,
            },
        })
        .then(() => handleDialogToggle())
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [updateReminderMutation, username, endDate, startDate, title, description, handleDialogToggle, reminder])

    // If reminder exists update, else create
    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        reminder ? updateReminder() : saveReminder()
    }, [reminder, saveReminder, updateReminder])

    // Delete reminder
    const handleReminderDelete = useCallback(() => {
        deleteReminderMutation({
            variables: {
                id: reminder?.id!,
            },
        })
        .then(() => {
            handleDialogToggle()
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [deleteReminderMutation, handleDialogToggle, reminder])

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
                <div className="dialog__content">
                    <div className="dialog__header-wrapper">
                        <p className="title">{reminder ? '✏️ Update' : '📦 Create'} Reminder</p>
                        {reminder && (
                            <button
                                onClick={handleReminderDelete}
                                className="button button--secondary button-delete"
                                type="button"
                            >
                                {deleteLoading ? <ButtonLoadingIcon /> : 'Delete'}
                            </button>
                        )}
                    </div>
                    <div className="form_input-wrapper">
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Title</p>
                            <input
                                className="form__input-field"
                                type="text"
                                required
                                name="title"
                                value={title}
                                onChange={setFormValue}
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Description</p>
                            <textarea
                                className="form__input-field form__input-area"
                                name="description"
                                rows={8}
                                value={description}
                                onChange={setFormValue}
                                maxLength={1900}
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Start</p>
                            <DatePicker
                                className="form__input-field"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                minDate={new Date()}
                                required
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">End</p>
                            <DatePicker
                                className="form__input-field"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                minDate={startDate}
                                required
                            />
                        </div>
                    </div>
                    {errors.error && <ErrorMessage error={errors.error} />}
                    <div className="form__button-group--right">
                        <button
                            onClick={handleDialogToggle}
                            className="form__button button button--secondary"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="form__button button button--primary"
                        >
                            {createLoading || updateLoading ? <ButtonLoadingIcon /> : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )

}
