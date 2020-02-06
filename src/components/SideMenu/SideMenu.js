// Other Imports
import React from "react";
import firebase from "../../firebase/Auth";
import clsx from 'clsx';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
// MUI Component Imports
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
// Icon Imports
import DashboardIcon from "@material-ui/icons/Dashboard";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import BookIcon from "@material-ui/icons/Book";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// Component Imports
import PrivateRoutes from "../../routers/PrivateRoutes";
// File Imports
import { ReactComponent as TextLogo } from "../../files/textLogo.svg";
import { ReactComponent as IconLogo } from "../../files/iconLogo.svg";


const useStyles = makeStyles(theme => ({
    sideMenuOpen: {
        width: 240,
    },
    sideMenuClosed: {
        overflowX: 'hidden',
        [theme.breakpoints.up('xs')]: {
            width: theme.spacing(7),
        },
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    }
}));

const SideMenu = () => {
    const classes = useStyles();

    const [open, toggleOpen] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState("dashboard");

    const toggleDrawer = () => {
        toggleOpen(!open);
    };

    // Sign user out
    const handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .catch(error => {
                console.error(error);
            });
    };

    // Sets the active menu item
    const handleActiveItem = event => {
        setActiveItem(event.currentTarget.name)
    };

    const getIcon = () => {
        return open ? <ChevronLeftIcon /> : <MenuIcon />;
    };

    const getLogo = () => {
        return open
            ? <TextLogo className="sidebar-menu__logo" />
            : <IconLogo className="sidebar-menu__logo" />
    };

    return (
        <div className="sidebar-menu">
            <Router>
                <Drawer
                    variant="permanent"
                    className={clsx({
                        [classes.sideMenuOpen]: open,
                        [classes.sideMenuClosed]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.sideMenuOpen]: open,
                            [classes.sideMenuClosed]: !open,
                        }),
                    }}
                >
                    <List>
                        {getLogo()}
                        <Link
                            to="/dashboard"
                            name="dashboard"
                            onClick={handleActiveItem}
                        >
                            <ListItem
                                button
                                selected={activeItem === "dashboard"}
                            >
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                        </Link>
                        <Link
                            to="/planner"
                            name="planner"
                            onClick={handleActiveItem}
                        >
                            <ListItem
                                button
                                selected={activeItem === "planner"}
                            >
                                <ListItemIcon>
                                    <DoneAllIcon />
                                </ListItemIcon>
                                <ListItemText primary="Planner" />
                            </ListItem>
                        </Link>
                        <Link
                            to="/journal"
                            name="journal"
                            onClick={handleActiveItem}
                        >
                            <ListItem
                                button
                                selected={activeItem === "journal"}
                            >
                                <ListItemIcon>
                                    <BookIcon />
                                </ListItemIcon>
                                <ListItemText primary="Journal" />
                            </ListItem>
                        </Link>
                        <Link
                            to="/weight"
                            name="weight"
                            onClick={handleActiveItem}
                        >
                            <ListItem button selected={activeItem === "weight"}>
                                <ListItemIcon>
                                    <FitnessCenterIcon />
                                </ListItemIcon>
                                <ListItemText primary="Weight" />
                            </ListItem>
                        </Link>
                        <Link
                            to="/settings"
                            name="settings"
                            onClick={handleActiveItem}
                        >
                            <ListItem
                                button
                                selected={activeItem === "settings"}
                            >
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItem>
                        </Link>
                        <ListItem
                            button
                            name="logout"
                            selected={activeItem === "logout"}
                            onClick={handleSignOut}
                        >
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Log Out" />
                        </ListItem>
                        <ListItem onClick={toggleDrawer} button>
                            <ListItemIcon>
                                {getIcon()}
                            </ListItemIcon>
                        </ListItem>
                    </List>
                </Drawer>
                <div className={classes.content}>
                    <PrivateRoutes />
                </div>
            </Router>
        </div>
    );
};

export default SideMenu
