import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/Settings'
import moment from 'moment'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { NavLink } from 'react-router-dom'
import { useToggle } from 'react-use'

import { ReactComponent as IconLogo } from '../../assets/images/logo/IconLogo.svg'
import { ReactComponent as TextLogo } from '../../assets/images/logo/TextLogo.svg'
import { logUserOut } from '../../redux/actions/userActions'

export const SideMenu: React.FC<{}> = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const [isSidemenuOpen, toggleSidemenu] = useToggle(false)

    // Logout - clear redux user, remove token from LS and redirect to /login
    const handleLogout = React.useCallback(() => {
        dispatch(logUserOut())
        window.localStorage.removeItem('token')
        history.push('/login')
    }, [dispatch, history])

    return (
        <div className={'side-menu ' + (isSidemenuOpen ? 'side-menu--open' : 'side-menu--closed')}>
            <div>
                <div className="side-menu__logo">
                    {isSidemenuOpen
                        ? <TextLogo className="side-menu__svg" />
                        : <IconLogo className="side-menu__svg" />}
                </div>
                <NavLink
                    to={`/dashboard/${moment().format('DoddddMMYYYY')}`}
                    name="dashboard"
                    className="side-menu__item"
                    activeClassName="side-menu__item--selected"
                    title="Dashboard"
                >
                    <DoneAllIcon />
                    <p className="side-menu__text">Dashboard</p>
                </NavLink>
                <NavLink
                    to="/settings"
                    name="settings"
                    className="side-menu__item"
                    activeClassName="side-menu__item--selected"
                    title="Dashboard"
                >
                    <SettingsIcon />
                    <p className="side-menu__text">Settings</p>
                </NavLink>
            </div>
            <div>
                <div
                    onClick={handleLogout}
                    className="side-menu__item"
                    title="Log Out"
                >
                    <ExitToAppIcon />
                    <p className="side-menu__text">Log Out</p>
                </div>
                <div
                    onClick={toggleSidemenu}
                    className="side-menu__item"
                    title="Toggle Menu"
                >
                    {isSidemenuOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    <p className="side-menu__text">Toggle Menu</p>
                </div>
            </div>
        </div>
    )
}

export default SideMenu
