import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/Settings'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { useToggle } from 'react-use'

import { ReactComponent as IconLogo } from '../../assets/images/logo/IconLogo.svg'
import { ReactComponent as TextLogo } from '../../assets/images/logo/TextLogo.svg'
import { setUser } from '../../redux/actions/userActions'

const SideMenu = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const [isSidemenuOpen, toggleSidemenu] = useToggle(false)
    const [activeLink, setActiveLink] = React.useState('dashboard')

    const handleLogout = React.useCallback(() => {
        dispatch(setUser(''))
        window.localStorage.removeItem('token')
        history.push('/login')
    }, [dispatch, history])

    return (
        <Drawer
            variant="permanent"
            className={
                'sidemenu ' +
                (
                    isSidemenuOpen
                        ? 'sidemenu--open'
                        : 'sidemenu--closed'
                )
            }
        >
            <div className="sidemenu__logo">
                {(
                    isSidemenuOpen
                        ? <TextLogo />
                        : <IconLogo />
                )}
            </div>
            <List className="sidemenu__items-wrapper">
                <Link
                    to="/dashboard"
                    name="dashboard"
                    onClick={setActiveLink}
                    className="sidemenu__item"
                >
                    <ListItem
                        button
                        selected={activeLink === 'dashboard'}
                    >
                        <ListItemIcon>
                            <DoneAllIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                </Link>
                <Link
                    to="/settings"
                    name="settings"
                    onClick={setActiveLink}
                    className="sidemenu__item"
                >
                    <ListItem
                        button
                        selected={activeLink === 'settings'}
                    >
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                </Link>
                <div className="sidemenu__bottom-actions">
                    <ListItem
                        button
                        onClick={handleLogout}
                        className="sidemenu__item"
                    >
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Log Out" />
                    </ListItem>
                    <ListItem
                        button
                        onClick={toggleSidemenu}
                        className="sidemenu__item"
                    >
                        <ListItemIcon>
                            {(
                                isSidemenuOpen
                                    ? <ChevronLeftIcon />
                                    : <ChevronRightIcon />
                            )}
                        </ListItemIcon>
                    </ListItem>
                </div>
            </List>
        </Drawer>
    )
}

export default SideMenu
