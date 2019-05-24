import React from "react";
import { Icon, Menu } from "semantic-ui-react";

class SideMenu extends React.Component {
    state = {
        activeItem: "dashboard"
    };

    handleActiveItem = (event, { name }) =>
        this.setState({ activeItem: "name" });

    render() {
        const { activeItem } = this.state;

        return (
            <Menu icon="labeled" vertical className="zero-margin-tb">
                <Menu.Item
                    name="dashboard"
                    active={activeItem === "dashboard"}
                    onClick={this.handleActiveItem}
                >
                    <Icon name="dashboard" />
                    Dashboard
                </Menu.Item>
                <Menu.Item
                    name="planner"
                    active={activeItem === "planner"}
                    onClick={this.handleActiveItem}
                >
                    <Icon name="tasks" />
                    Planner
                </Menu.Item>
                <Menu.Item
                    name="jorunal"
                    active={activeItem === "journal"}
                    onClick={this.handleActiveItem}
                >
                    <Icon name="book" />
                    Journal
                </Menu.Item>
                <Menu.Item
                    name="weight"
                    active={activeItem === "weight"}
                    onClick={this.handleActiveItem}
                >
                    <Icon name="weight" />
                    Weight
                </Menu.Item>
                <Menu.Item
                    name="settings"
                    active={activeItem === "settings"}
                    onClick={this.handleActiveItem}
                >
                    <Icon name="cog" />
                    Settings
                </Menu.Item>
            </Menu>
        );
    }
}

export default SideMenu;
