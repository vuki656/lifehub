import React from "react";

import { Link, BrowserRouter as Router } from "react-router-dom";
import { Icon, Menu, Grid } from "semantic-ui-react";

import PrivateRoutes from "../../routers/PrivateRoutes";

class SideMenu extends React.Component {
    state = {
        activeItem: "dashboard"
    };

    // Sets the active menu item(background)
    handleActiveItem = (event, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;

        return (
            <Grid>
                <Grid.Row>
                    <Router>
                        <Grid.Column width={1}>
                            <Menu
                                icon="labeled"
                                vertical
                                className="zero-margin-tb"
                            >
                                <Menu.Item
                                    as={Link}
                                    to="/dashboard"
                                    name="dashboard"
                                    active={activeItem === "dashboard"}
                                    onClick={this.handleActiveItem}
                                >
                                    <Icon name="dashboard" />
                                    Dashboard
                                </Menu.Item>

                                <Menu.Item
                                    as={Link}
                                    to="/planner"
                                    name="planner"
                                    active={activeItem === "planner"}
                                    onClick={this.handleActiveItem}
                                >
                                    <Icon name="tasks" />
                                    Planner
                                </Menu.Item>
                                <Menu.Item
                                    as={Link}
                                    to="/journal"
                                    name="journal"
                                    active={activeItem === "journal"}
                                    onClick={this.handleActiveItem}
                                >
                                    <Icon name="book" />
                                    Journal
                                </Menu.Item>
                                <Menu.Item
                                    as={Link}
                                    to="/weight"
                                    name="weight"
                                    active={activeItem === "weight"}
                                    onClick={this.handleActiveItem}
                                >
                                    <Icon name="weight" />
                                    Weight
                                </Menu.Item>
                                <Menu.Item
                                    as={Link}
                                    to="/settings"
                                    name="settings"
                                    active={activeItem === "settings"}
                                    onClick={this.handleActiveItem}
                                >
                                    <Icon name="cog" />
                                    Settings
                                </Menu.Item>
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <PrivateRoutes />
                        </Grid.Column>
                    </Router>
                </Grid.Row>
            </Grid>
        );
    }
}

export default SideMenu;
