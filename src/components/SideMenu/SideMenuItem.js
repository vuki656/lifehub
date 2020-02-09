// Other Imports
import React from "react";
import { Link } from "react-router-dom";
// MUI Component Imports
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// Helper Imports
import { getWordToTitleCase } from "../../helpers/Global";

const SideMenuItem = (props) => {
    const { handleActiveItem, linkName, activeLink, icon } = props;

    return (
        <Link
            to={`/${linkName}`}
            name={linkName}
            onClick={handleActiveItem}
            className="sidemenu__item"
        >
            <ListItem
                button
                selected={activeLink === linkName}
            >
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={getWordToTitleCase(linkName)} />
            </ListItem>
        </Link>
    )
};

export default SideMenuItem;
