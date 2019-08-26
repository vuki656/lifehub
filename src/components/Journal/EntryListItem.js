// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";

// Destructured Imports
import { List, Icon, Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";

// Helper Imports
import { formatMoment } from "../../helpers/Global";

class EntryListItem extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        journalRef: firebase.database().ref("journal-entries"),
        journalEntry: this.props.journalEntry
    };

    // Delete journal entry in firebase
    deleteEntry = ({ journalRef, currentUser, journalEntry }) => {
        journalRef.child(`${currentUser.uid}/${journalEntry.key}`).remove();
    };

    render() {
        const { journalEntry } = this.state;

        return (
            <List.Item
                as={Link}
                to={`/journal/${journalEntry.key}`}
                key={journalEntry.key}
                className="journal-list-item"
            >
                <List.Content>
                    <List.Header>{journalEntry.title}</List.Header>
                    <List.Description className="journal-list-item-date">
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={12} float="left">
                                    <p>
                                        Created at:{" "}
                                        {formatMoment(
                                            journalEntry.createdAt,
                                            "DD/MM/YYYY"
                                        )}
                                    </p>
                                </Grid.Column>
                                <Grid.Column width={4} float="right">
                                    <Icon
                                        name="remove"
                                        onClick={() =>
                                            this.deleteEntry(this.state)
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

export default EntryListItem;
