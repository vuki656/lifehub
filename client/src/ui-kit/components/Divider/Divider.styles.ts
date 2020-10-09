import styled from 'styled-components'

export const DividerRoot = styled('div')((props) => ({
    borderBottomColor: props.theme.palette.grey.light300,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    height: '1px',
    width: '100%',
}))
