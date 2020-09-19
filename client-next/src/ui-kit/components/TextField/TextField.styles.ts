import styled from 'styled-components'

export const TextFieldLabel = styled('p')((props) => ({
    ...props.theme.typography.regular,
    fontWeight: 'bold',
    margin: '0 0 5px 0',
}))

export const TextFieldInput = styled('input')((props) => ({
    '&:focus': { boxShadow: `0 0 0 4px ${props.theme.palette.greys.light}` },
    borderColor: props.theme.palette.greys.light,
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    outline: 'none',
    padding: props.theme.spacing.def,
    transition: props.theme.transitions.create('box-shadow'),
}))
