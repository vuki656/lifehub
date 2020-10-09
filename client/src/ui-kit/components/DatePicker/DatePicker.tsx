import * as React from 'react'
import DatePickerComponent from 'react-datepicker'

import {
    DatePickerLabel,
    DatePickerRoot,
} from './DatePicker.styles'
import { DatePickerProps } from './DatePicker.types'

export const DatePicker: React.FunctionComponent<DatePickerProps> = (props) => {
    const {
        fullWidth = false,
        label,
        selected: selectedProp,
        ...other
    } = props

    const selected = selectedProp ? new Date(selectedProp) : null

    return (
        <DatePickerRoot fullWidth={fullWidth}>
            {label ? (
                <DatePickerLabel>
                    {label}
                </DatePickerLabel>
            ) : null}
            <DatePickerComponent
                autoComplete="off"
                selected={selected}
                {...other}
            />
        </DatePickerRoot>
    )
}
