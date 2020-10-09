import React from 'react'

export type DialogProps = {
    isOpen: boolean,
    onSubmit(formValues: unknown): Promise<void>, // TODO: UNKNOWN?
    toggleDialog(): void,
    title: string,
    titleButton?: React.ReactNode
    submitButton: React.ReactNode
}
