import React from "react";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Icon, Menu, Grid } from "semantic-ui-react";

import Dashboard from "./Dashboard/Dashboard";
import Planner from "./Planner/Planner";
import Journal from "./Journal/Journal";
import Weight from "./Weight/Weight";
import Settings from "./Settings/Settings";

class SidebarExample extends React.Component {
    state = {
        activeItem: ""
    };

    render() {
        const { activeItem } = this.state;

        return (
            <Router>
                <div style={{ display: "flex" }}>
                    <div
                        style={{
                            width: "5%",
                            background: "#f0f0f0"
                        }}
                    >
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
                    </div>

                    <div>
                        <Route path="/dashboard" component={Dashboard} />
                        <Route path="/planner" component={Planner} />
                        <Route path="/journal" component={Journal} />
                        <Route path="/weight" component={Weight} />
                        <Route path="/settings" component={Settings} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default SidebarExample;
