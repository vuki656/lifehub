// Other Imports
import React from "react";
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

const SideMenu = () => {
    const [open, toggleOpen] = React.useState(false);
    const [activeLink, setActiveLink] = React.useState("dashboard");

    // Open/close sidemenu drawer
    const toggleDrawer = () => {
        toggleOpen(!open);
    };

    // Sets the active menu item
    const handleActiveLink = event => {
        setActiveLink(event.currentTarget.name)
    };

    // Get logo based on menu open state
    const getLogo = () => {
        return open
            ? <TextLogo />
            : <IconLogo />
    };

    return (
        <Drawer
            variant="permanent"
            className={
                "sidemenu " +
                (open ? "sidemenu--open" : "sidemenu--closed")
            }
        >
            <div className="sidemenu__logo">
                {getLogo()}
            </div>
            <List className="sidemenu__items">
                {sidebarMenuPages.map((page) => (
                    <SideMenuItem
                        activeLink={activeLink}
                        linkName={page.linkName}
                        handleActiveItem={handleActiveLink}
                        icon={page.icon}
                        key={page.linkName}
                    />
                ))}
                <SideMenuBottomActions
                    open={open}
                    toggleDrawer={toggleDrawer}
                />
            </List>
        </Drawer>
    );
};

export default SideMenu
