// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";

// Destructured Imports
import {
    Typography,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    List
} from "@material-ui/core";
import { Link } from "react-router-dom";

// Icon Imports
import DeleteIcon from "@material-ui/icons/Delete";

// Helper Imports
import { formatMoment } from "../../helpers/Global";

class EntryListItem extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        journalRef: firebase.database().ref("journal-entries"),

        // Props
        journalEntry: this.props.journalEntry
    };

    // Delete journal entry in firebase
    deleteEntry = ({ journalRef, currentUser, journalEntry }) => {
        journalRef.child(`${currentUser.uid}/${journalEntry.key}`).remove();
    };

    render() {
        const { journalEntry } = this.state;

        let formatedDate = (
            <Typography>
                Created at: {formatMoment(journalEntry.createdAt, "DD/MM/YYYY")}
            </Typography>
        );

        return (
            <List>
                <Link
                    to={`/journal/${journalEntry.key}`}
                    key={journalEntry.key}
                >
                    <ListItem>
                        <ListItemText
                            primary={journalEntry.title}
                            secondary={formatedDate}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                onClick={() => this.deleteEntry(this.state)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </Link>
            </List>
        );
    }
}

export default EntryListItem;
