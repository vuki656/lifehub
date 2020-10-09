import styled from 'styled-components'

export const DialogOverlay = styled('div')((props) => ({
    alignItems: 'center',
    backgroundColor: '#00000080',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: props.theme.zIndex.modal,
}))

export const DialogRoot = styled('div')((props) => ({
    backgroundColor: props.theme.palette.white,
    borderRadius: '5px',
    boxShadow: `0 2px 10px 0 ${props.theme.palette.grey.dark}`,
    padding: props.theme.spacing.md,
    width: '500px',
}))

export const DialogHeader = styled('div')((props) => ({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: props.theme.spacing.md,
}))
export const DialogTitle = styled('p')((props) => ({
    ...props.theme.typography.title,
    margin: 0,
}))

export const DialogContent = styled('div')({
    display: 'flex',
    flexDirection: 'column',
})
