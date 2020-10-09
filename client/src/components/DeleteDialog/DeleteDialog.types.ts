export type DeleteDialogProps = {
    name: string,
    onDelete(): void,
    loading: boolean,
    isOpen: boolean,
    toggleDialog(): void,
}
