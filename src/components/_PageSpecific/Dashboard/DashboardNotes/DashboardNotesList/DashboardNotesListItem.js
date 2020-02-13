// Object Imports
import React from "react";
import firebase from "../../../../../helpers/firebase/Auth";

// Destructured Imports
import {
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton
} from "@material-ui/core";

// Icon Imports
import DeleteIcon from "@material-ui/icons/Delete";

class DashboardNotesListItem extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        notesRef: firebase.database().ref("dashboard-notes"),

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
            <ListItem wrap="nowrap">
                <ListItemIcon>
                    <IconButton onClick={() => this.deleteNote(this.state)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemIcon>
                <ListItemText primary={note.text} />
            </ListItem>
        );
    }
}

export default DashboardNotesListItem;
