import { useState } from 'react'

export function useFormFields(initialValues) {
    const [fields, setValues] = useState(initialValues)

    const handleValueSet = (event) => {
        setValues({ ...fields, [event.target.name]: event.target.value })
    }

    const clearForm = () => {
        setValues({})
    }

    return [fields, handleValueSet, clearForm]
}
