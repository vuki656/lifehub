import React from "react";
import firebase from "../../firebase/Auth";

import { Menu } from "semantic-ui-react";
import { history } from "../../routers/AppRouter";

class TopMenu extends React.Component {
    state = {};

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                history.psuh("/login");
            })
            .catch(error => {
                console.error(error);
            });
    };

    render() {
        return (
            <Menu pointing secondary className="zero-margin-tb">
                <Menu.Menu position="left">
                    <Menu.Item>LifeHub</Menu.Item>
                </Menu.Menu>
                <Menu.Menu position="right">
                    <Menu.Item>Domagoj Vukovic</Menu.Item>
                    <Menu.Item name="logout" onClick={this.handleSignOut} />
                </Menu.Menu>
            </Menu>
        );
    }
}

export default TopMenu;
