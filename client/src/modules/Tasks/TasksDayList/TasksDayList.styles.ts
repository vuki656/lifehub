import dayjs from 'dayjs'
import styled, { CSSObject } from 'styled-components'

import { DownIcon } from '../../../ui-kit/icons/DownIcon'
import { UpIcon } from '../../../ui-kit/icons/UpIcon'

export const TasksDayLisRoot = styled('div')((props) => ({
    backgroundColor: props.theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: '150px',
    width: '150px',
}))

type DayListItemProps = {
    selected: boolean,
    day: dayjs.Dayjs
}

export const DayListItem = styled('a')<DayListItemProps>((props) => {
    let styles: CSSObject = {
        '&:hover': {
            backgroundColor: props.theme.palette.grey.light500,
            cursor: 'pointer',
        },
        alignItems: 'center',
        color: `${props.theme.palette.grey.main} !important`,
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'flex-start',
        margin: 0,
        padding: `0 ${props.theme.spacing.md}`,
        userSelect: 'none',
    }

    if (props.selected) {
        styles = {
            ...styles,
            backgroundColor: props.theme.palette.grey.light500,
        }
    }

    if (dayjs(props.day).isSame(new Date, 'date')) {
        styles = {
            ...styles,
            fontWeight: 'bold',
        }
    }

    return styles
})

export const DayListButton = styled('div')((props) => ({
    '&:hover': {
        backgroundColor: props.theme.palette.grey.light500,
        cursor: 'pointer',
    },
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    margin: 0,
    maxHeight: '35px',
    padding: `0 ${props.theme.spacing.md}`,
}))

export const GoForwardIcon = styled(DownIcon)((props) => ({ fill: props.theme.palette.grey.light100 }))
export const GoBackwardIcon = styled(UpIcon)((props) => ({ fill: props.theme.palette.grey.light100 }))

export const MonthTitle = styled('p')((props) => ({
    alignItems: 'center',
    backgroundColor: props.theme.palette.grey.light500,
    color: props.theme.palette.grey.dark300,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 0,
    padding: `${props.theme.spacing.sm} ${props.theme.spacing.md}`,
    userSelect: 'none',
}))
