import _ from 'lodash'
import { useState } from 'react'

export function useFormFields(initialValues) {
    const [formValues, setValues] = useState(initialValues)

    const resetForm = () => {
        setValues(initialValues)
    }

    const setFormValue = (value, name) => {
        setValues({ ...formValues, [name]: value })
    }

    // Set all values in object to empty string
    const clearForm = () => {
        const emptyObject = _.mapValues(formValues, () => '')
        setValues(emptyObject)
    }

    return { formValues, setFormValue, clearForm, resetForm }
}
