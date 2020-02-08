// Other Imports
import React from "react";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
// MUI Component Imports
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
// Component Imports
import SideMenuBottomActions from "./SideMenuBottomActions";
import SideMenuItem from "./SideMenuItem";
// File Imports
import { ReactComponent as TextLogo } from "../../images/textLogo.svg";
import { ReactComponent as IconLogo } from "../../images/iconLogo.svg";
// Data Imports
import { sidebarMenuPages } from "../../data/sidebarPages"

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
    }
}));

const SideMenu = () => {
    const classes = useStyles();

    const [open, toggleOpen] = React.useState(false);
    const [activeLink, setActiveLink] = React.useState("dashboard");

    const toggleDrawer = () => {
        toggleOpen(!open);
    };

    // Sets the active menu item
    const handleActiveLink = event => {
        setActiveLink(event.currentTarget.name)
    };

    const getLogo = () => {
        return open
            ? <TextLogo className="sidebar-menu__logo" />
            : <IconLogo className="sidebar-menu__logo" />
    };

    return (
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
            {getLogo()}
            <List>
                {sidebarMenuPages.map((page) => (
                    <SideMenuItem
                        activeLink={activeLink}
                        linkName={page.linkName}
                        handleActiveItem={handleActiveLink}
                        icon={page.icon}
                        key={page.linkName}
                    />
                ))}
                <SideMenuBottomActions open={open} toggleDrawer={toggleDrawer} />
            </List>
        </Drawer>
    );
};

export default SideMenu
