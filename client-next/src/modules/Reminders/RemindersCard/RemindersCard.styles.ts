import styled from "styled-components"

import { AlarmOnIcon } from "../../../ui-kit/icons/AlarmOnIcon"
import { EventIcon } from "../../../ui-kit/icons/EventIcon"

export const RemindersCardRoot = styled('div')((props) => ({
    borderColor: props.theme.palette.grey.light350,
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: props.theme.spacing.def,
    padding: props.theme.spacing.def,
    rowGap: '10px',
}))

export const RemindersCardTitle = styled('p')((props) => ({
    ...props.theme.typography.subtitle,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}))

export const RemindersCardContent = styled('div')({
    display: "flex",
    flexDirection: 'row',
})

export const ReminderCardDate = styled('div')({
    alignItems: 'center',
    display: 'flex',
    marginRight: '10px',
})

export const ReminderCardDateText = styled('p')((props) => ({
    color: props.theme.palette.grey.light100,
    fontSize: "14px",
    margin: 0,
    paddingTop: '1px',
}))

export const ReminderCardDateIcon = styled(EventIcon)((props) => ({
    fill: props.theme.palette.grey.light100,
    marginRight: props.theme.spacing.xxs,
}))

export const ReminderCardRemainingDays = styled('div')({
    alignItems: 'center',
    display: 'flex',
})

export const ReminderCardRemainingDaysIcon = styled(AlarmOnIcon)((props) => ({
    fill: props.theme.palette.grey.light100,
    marginRight: props.theme.spacing.xxs,
}))

export const ReminderCardRemainingText = styled('p')((props) => ({
    color: props.theme.palette.grey.light100,
    fontSize: "14px",
    margin: 0,
    paddingTop: '1px',
}))

