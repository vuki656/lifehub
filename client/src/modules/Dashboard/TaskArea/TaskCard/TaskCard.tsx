import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import React from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { Message } from '../../../../components/Message'
import { UserStateType } from '../../../../redux/reducers/user'
import { Task } from '../Task'

import type { TaskCardProps } from './TaskCard.types'

export const TaskCard: React.FC<TaskCardProps> = (props) => {
    const { taskCard } = props

    const [isEditDialogOpen, toggleEditDialog] = useToggle(false)

    const [isDeleteDialogOpen, toggleDeleteDialog] = useToggle(false)

    const [errors, setErrors] = React.useState<{error?: string}>()

    const { selectedDate } = useSelector((state: UserStateType) => state)

    return (
        <div className="task-card">
            <div className="task-card__header">
                <p className="task-card__name">{taskCard.name}</p>
                <div>
                    <DeleteOutlineRoundedIcon
                        className="task-card__icon"
                        onClick={toggleDeleteDialog}
                    />
                    <EditRoundedIcon
                        className="task-card__icon"
                        onClick={toggleEditDialog}
                    />
                </div>
            </div>
            <div className="task-card__body">
                {/* {taskCard.tasks.map((task) => ( */}
                {/*    <Task task={task} taskCard={taskCard} key={task.id} /> */}
                {/* ))} */}
            </div>
            <div className="task-card__input">
                <form>
                    <input
                        className="form__input-field task-card__input-field"
                        type="text"
                        required
                        placeholder="Click to quickly add a task"
                        name="title"
                        // onChange={createTaskForm.handleChange}
                        // value={createTaskForm.values.title}
                        maxLength={150}
                    />
                </form>
            </div>
            {errors?.error && <Message
                message={errors.error}
                type="error"
            />}
        </div>
    )
}
