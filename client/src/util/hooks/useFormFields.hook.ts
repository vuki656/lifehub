import _ from 'lodash'
import { useState } from 'react'

export function useFormFields(initialValues) {
    const [fields, setValues] = useState(initialValues)

    const handleValueSet = (event) => {
        setValues({ ...fields, [event.target.name]: event.target.value })
    }

    // Set all values in object to empty string
    const clearForm = () => {
        const result = _.mapValues(fields, () => '')
        setValues(result)
    }

    return [fields, handleValueSet, clearForm]
}
