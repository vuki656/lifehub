import React from "react";
import firebase from "../../firebase/Auth";

import { Menu } from "semantic-ui-react";

class TopMenu extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser
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

    render() {
        const { currentUser } = this.state;

        return (
            <Menu pointing secondary className="zero-margin-tb">
                <Menu.Menu position="left">
                    <Menu.Item>LifeHub</Menu.Item>
                </Menu.Menu>
                <Menu.Menu position="right">
                    {console.log("i rendered")}
                    <Menu.Item>{currentUser.displayName}</Menu.Item>
                    <Menu.Item name="logout" onClick={this.handleSignOut} />
                </Menu.Menu>
            </Menu>
        );
    }
}

export default TopMenu;
