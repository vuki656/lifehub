// Object Imports
import React from "react";
import firebase from "../firebase/Auth";

// Destructured Imports
import { Icon, Menu, Grid } from "semantic-ui-react";
import { Link, BrowserRouter as Router } from "react-router-dom";

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

    // Sets the active menu item(background)
    handleActiveItem = (event, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem, currentUser } = this.state;

        return (
            <Grid className="react-app">
                <Grid.Row>
                    <Router>
                        <Grid.Column
                            width={2}
                            className="side-menu pad-top-bot-10-px pad-lef-rig-0"
                        >
                            <div className="logo-section">
                                <Logo className="logo" />
                                <p className="sidebar-username">
                                    {currentUser.displayName}
                                </p>
                            </div>
                            <Menu
                                vertical
                                fluid
                                borderless
                                className="zero-margin-tb"
                            >
                                <Menu.Item
                                    as={Link}
                                    to="/dashboard"
                                    name="dashboard"
                                    active={activeItem === "dashboard"}
                                    onClick={this.handleActiveItem}
                                    className="pad-lef-25-px side-menu-item"
                                >
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Icon
                                                    name="dashboard"
                                                    color="grey"
                                                    className="sidebar-menu-item-icon"
                                                />
                                            </Grid.Column>
                                            <Grid.Column>Dashboard</Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                    <React.Fragment />
                                </Menu.Item>
                                <Menu.Item
                                    as={Link}
                                    to="/planner"
                                    name="planner"
                                    active={activeItem === "planner"}
                                    onClick={this.handleActiveItem}
                                    className="pad-lef-25-px side-menu-item"
                                >
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Icon
                                                    name="tasks"
                                                    className="sidebar-menu-item-icon"
                                                />
                                            </Grid.Column>
                                            <Grid.Column>Planner</Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Menu.Item>
                                <Menu.Item
                                    as={Link}
                                    to="/journal"
                                    name="journal"
                                    active={activeItem === "journal"}
                                    onClick={this.handleActiveItem}
                                    className="pad-lef-25-px side-menu-item"
                                >
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Icon
                                                    name="book"
                                                    className="sidebar-menu-item-icon"
                                                />
                                            </Grid.Column>
                                            <Grid.Column>Journal</Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Menu.Item>
                                <Menu.Item
                                    as={Link}
                                    to="/weight"
                                    name="weight"
                                    active={activeItem === "weight"}
                                    onClick={this.handleActiveItem}
                                    className="pad-lef-25-px side-menu-item"
                                >
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Icon
                                                    name="weight"
                                                    className="sidebar-menu-item-icon"
                                                />
                                            </Grid.Column>
                                            <Grid.Column>Weight</Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Menu.Item>
                                <Menu.Item
                                    as={Link}
                                    to="/settings"
                                    name="settings"
                                    active={activeItem === "settings"}
                                    onClick={this.handleActiveItem}
                                    className="pad-lef-25-px side-menu-item"
                                >
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Icon
                                                    name="cog"
                                                    className="sidebar-menu-item-icon"
                                                />
                                            </Grid.Column>
                                            <Grid.Column>Settings</Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Menu.Item>

                                <Menu.Item
                                    onClick={this.handleSignOut}
                                    className="pad-lef-25-px side-menu-item"
                                >
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Icon
                                                    name="sign-out"
                                                    className="sidebar-menu-item-icon"
                                                />
                                            </Grid.Column>
                                            <Grid.Column>Logout</Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Menu.Item>
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={14}>
                            <PrivateRoutes />
                        </Grid.Column>
                    </Router>
                </Grid.Row>
            </Grid>
        );
    }
}

export default SideMenu;
