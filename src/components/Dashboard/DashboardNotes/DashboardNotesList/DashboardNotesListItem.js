// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { List, Icon } from "semantic-ui-react";

class DashboardNotesListItem extends React.Component {
    state = {
        notesRef: firebase.database().ref("dashboard-notes"),
        currentUser: firebase.auth().currentUser,

        // Props
        note: this.props.note
    };

    // Delete note in firebase
    deleteNote = ({ notesRef, currentUser, note }) => {
        notesRef.child(`${currentUser.uid}/${note.key}`).remove();
    };

    render() {
        const { note } = this.state;

        return (
            <List.Item className="add-dashboard-note-list-item">
                <Icon
                    name="remove"
                    onClick={() => this.deleteNote(this.state)}
                />
                <List.Content>
                    <List.Description>{note.text}</List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

export default DashboardNotesListItem;
