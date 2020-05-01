import _ from 'lodash'
import { useState } from 'react'

export function useFormFields(initialValues) {
    const [fields, setValues] = useState(initialValues)

    const resetForm = () => {
        setValues(initialValues)
    }

    const handleValueSet = (value, name) => {
        setValues({ ...fields, [name]: value })
    }

    // Set all values in object to empty string
    const clearForm = () => {
        const emptyObject = _.mapValues(fields, () => '')
        setValues(emptyObject)
    }

    return [fields, handleValueSet, clearForm, resetForm]
}
