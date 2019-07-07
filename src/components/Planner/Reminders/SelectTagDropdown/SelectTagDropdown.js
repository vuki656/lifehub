// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Dropdown, Icon, Header } from "semantic-ui-react";

// Component Imports
import DropdownTagItem from "./DropdownTagItem";

class SelectTagDropdown extends React.Component {
    state = {
        selectedTag: null,
        reminderTags: null,
        reminderTagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser
    };

    componentDidMount() {
        this.fetchReminderTags(this.state);
    }

    // Fetch reminder tag list from firebase
    fetchReminderTags = ({ reminderTagsRef, currentUser }) => {
        let tagHolder = [];

        reminderTagsRef.child(currentUser.uid).once("value", tags => {
            if (tags) {
                tags.forEach(tag => {
                    let key = tag.key;
                    let text = tag.val().text;

                    tagHolder.push({ key, text });
                });
                this.setState({ reminderTags: tagHolder });
            }
        });
    };

    // Render tags in dropdown
    renderTags = ({ reminderTags }) => {
        if (reminderTags) {
            return reminderTags.map(tag => (
                <DropdownTagItem tag={tag} key={tag.key} />
            ));
        } else {
            return "No Tags";
        }
    };

    render() {
        const { reminderTags } = this.state;

        return reminderTags ? (
            <Dropdown placeholder="Choose Your Tag" fluid>
                <Dropdown.Menu>{this.renderTags(this.state)}</Dropdown.Menu>
            </Dropdown>
        ) : (
            <p>Loading...</p>
        );
    }
}

export default SelectTagDropdown;
