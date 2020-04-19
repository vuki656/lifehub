import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/Settings'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { NavLink } from 'react-router-dom'
import { useToggle } from 'react-use'

import { ReactComponent as IconLogo } from '../../assets/images/logo/IconLogo.svg'
import { ReactComponent as TextLogo } from '../../assets/images/logo/TextLogo.svg'
import { setUser } from '../../redux/actions/userActions'

const SideMenu = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const [isSidemenuOpen, toggleSidemenu] = useToggle(false)

    // Clear redux user, remove token from ls and redirect to /login
    const handleLogout = React.useCallback(() => {
        dispatch(setUser(''))
        window.localStorage.removeItem('token')
        history.push('/login')
    }, [dispatch, history])

    return (
        <div className={'sidemenu ' + (isSidemenuOpen ? 'sidemenu--open' : 'sidemenu--closed')}>
            <div>
                <div className="sidemenu__logo">
                    {isSidemenuOpen ? <TextLogo /> : <IconLogo />}
                </div>
                <NavLink
                    to="/dashboard"
                    name="dashboard"
                    className="sidemenu__item"
                    activeClassName="sidemenu__item--selected"
                    title="Dashboard"
                >
                    <DoneAllIcon />
                    <p>Dashboard</p>
                </NavLink>
                <NavLink
                    to="/settings"
                    name="settings"
                    className="sidemenu__item"
                    activeClassName="sidemenu__item--selected"
                    title="Dashboard"
                >
                    <SettingsIcon />
                    <p>Settings</p>
                </NavLink>
            </div>
            <div>
                <div
                    onClick={handleLogout}
                    className="sidemenu__item"
                    title="Log Out"
                >
                    <ExitToAppIcon />
                    <p>Log Out</p>
                </div>
                <div
                    onClick={toggleSidemenu}
                    className="sidemenu__item"
                    title="Toggle Menu"
                >
                    {
                        isSidemenuOpen
                            ? <ChevronLeftIcon />
                            : <ChevronRightIcon />
                    }
                    <p>Toggle Menu</p>
                </div>
            </div>
        </div>
    )
}

export default SideMenu
