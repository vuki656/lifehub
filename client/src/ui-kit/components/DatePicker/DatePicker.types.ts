import { ReactDatePickerProps } from 'react-datepicker'

export type DatePickerProps =
    Omit<ReactDatePickerProps, 'selected'>
    & {
    fullWidth?: boolean,
    label?: string,
    selected: Date | string | null,
}
