// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Dropdown, Icon } from "semantic-ui-react";

class DropdownTagItem extends React.Component {
    state = {
        reminderTagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser,

        tag: this.props.tag
    };

    // Remove tag from firebase
    removeTag = () => {
        const { tag, reminderTagsRef, currentUser } = this.state;

        reminderTagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .remove()
            .catch(err => console.err(err));
    };

    render() {
        return (
            <Dropdown.Item>
                <Icon onClick={this.removeTag} name="delete" key="123" />
                <span onClick={this.addTag}>MY CUSTOM TAG</span>
            </Dropdown.Item>
        );
    }
}

export default DropdownTagItem;
