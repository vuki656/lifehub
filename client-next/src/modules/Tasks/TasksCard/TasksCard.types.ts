import { CardType } from "../TasksCardDialog"

export type TasksCardProps = {
    card: CardType
}

export type TaskType = {
    id?: string,
    title: string,
    note?: string,
    date: string,
    isCompleted: boolean,
}

export type CreateTaskFormType = {
    title: string,
}
