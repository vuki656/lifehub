import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded'
import WarningRoundedIcon from '@material-ui/icons/WarningRounded'
import React, {
    useCallback,
    useEffect,
    useState,
} from 'react'

import { MessageProps } from './Message.types'

export const Message: React.FC<MessageProps> = (props) => {
    const {
        message = '',
        type,
    } = props

    const [messageColor, setMessageColor] = useState<string>('')
    const [icon, setIcon] = useState(<WarningRoundedIcon className="info-icon" style={{ color: messageColor }} />)

    const setInitialMessageColor = useCallback(() => {
        switch (type) {
            case 'error':
                setMessageColor('#cd3d64')
                setIcon(
                    <WarningRoundedIcon className="info-icon" style={{ color: '#cd3d64' }} />,
                )
                break
            case 'info':
                setMessageColor('#bbbbbb')
                setIcon(
                    <HelpOutlineRoundedIcon className="info-icon" style={{ color: '#bbbbbb' }} />,
                )
                break
        }
    }, [type])

    useEffect(() => {
        setInitialMessageColor()
    }, [setInitialMessageColor])

    return (
        <div className="info-wrapper">
            {icon}
            <p
                className="info-text"
                style={{ color: messageColor }}
            >
                {message}
            </p>
        </div>
    )
}
