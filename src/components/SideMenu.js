// Object Imports
import React from "react";
import firebase from "../firebase/Auth";

// Destructured Imports
import {
    Grid,
    Typography,
    ListItem,
    ListItemText,
    ListItemIcon,
    Box
} from "@material-ui/core";
import { Link, BrowserRouter as Router } from "react-router-dom";

// Icon Imports
import DashboardIcon from "@material-ui/icons/Dashboard";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import BookIcon from "@material-ui/icons/Book";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

// Component Imports
import PrivateRoutes from "../routers/PrivateRoutes";

// File Imports
import { ReactComponent as Logo } from "../files/logo.svg";

class SideMenu extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        activeItem: "dashboard"
    };

    // Sign user out
    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .catch(error => {
                console.error(error);
            });
    };

    // Sets the active menu item
    handleActiveItem = event => {
        this.setState({ activeItem: event.currentTarget.name });
    };

    render() {
        const { activeItem, currentUser } = this.state;

        return (
            <Grid container>
                <Router>
                    <Grid className="side-menu">
                        <Box>
                            <Grid
                                container
                                alignItems="center"
                                justify="center"
                            >
                                <Grid item xs={8}>
                                    <Logo className="logo" />
                                </Grid>
                            </Grid>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                className="mar-bot-1-rem"
                            >
                                {currentUser.displayName}
                            </Typography>
                        </Box>
                        <Link
                            to="/dashboard"
                            name="dashboard"
                            onClick={this.handleActiveItem}
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
                            onClick={this.handleActiveItem}
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
                            onClick={this.handleActiveItem}
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
                            onClick={this.handleActiveItem}
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
                            onClick={this.handleActiveItem}
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
                            onClick={this.handleSignOut}
                        >
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Log Out" />
                        </ListItem>
                    </Grid>
                    <Grid xs>
                        <PrivateRoutes />
                    </Grid>
                </Router>
            </Grid>
        );
    }
}

export default SideMenu;
