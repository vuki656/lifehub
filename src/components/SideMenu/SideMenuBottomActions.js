// Other Imports
import React from "react";
import firebase from "../../firebase/Auth";
// MUI Component Imports
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// Icon Imports
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const SideMenuBottomActions = (props) => {
    const { open, toggleDrawer } = props;

    // Sign user out
    const handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .catch(error => {
                console.error(error);
            });
    };

    // Set side-menu open/close icon based on open state
    const getIcon = () => {
        return open ? <ChevronLeftIcon /> : <MenuIcon />;
    };

    return (
        <div className="sidemenu__bottomactions">
            <ListItem
                button
                onClick={handleSignOut}
                className="sidemenu__item"
            >
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Log Out" />
            </ListItem>
            <ListItem
                button
                onClick={toggleDrawer}
                className="sidemenu__item"
            >
                <ListItemIcon>
                    {getIcon()}
                </ListItemIcon>
            </ListItem>
        </div>
    );
};

export default SideMenuBottomActions
