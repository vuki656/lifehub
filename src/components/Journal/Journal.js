// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { Grid, Button } from "semantic-ui-react";
import { Route } from "react-router-dom";

// Component Imports
import EntryList from "./EntryList";
import EntryField from "./EntryField";

class Journal extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            journalEntries: null,
            currentUser: firebase.auth().currentUser,
            journalRef: firebase.database().ref("journal-entries"),
            activeEntry: ""
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchJournalEntries(this.state);
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners(this.state);
        this._isMounted = false;
    }

    addListeners = () => {
        this.addJournalEntryListener(this.state);
        this.addRemoveJournalEntryListener(this.state);
        this.addUpdateJournalEntryListener(this.state);
    };

    removeListeners = ({ journalRef, currentUser }) => {
        journalRef.child(`${currentUser.uid}`).off();
    };

    // Listen for new journal inputs
    addJournalEntryListener = ({ currentUser, journalRef }) => {
        journalRef.child(currentUser.uid).on("child_added", () => {
            this.fetchJournalEntries(this.state);
        });
    };

    // Listen for new journal deletions
    addRemoveJournalEntryListener = ({ currentUser, journalRef }) => {
        journalRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchJournalEntries(this.state);
        });
    };

    // Listen for new journal updates
    addUpdateJournalEntryListener = ({ currentUser, journalRef }) => {
        journalRef.child(currentUser.uid).on("child_changed", () => {
            this.fetchJournalEntries(this.state);
        });
    };

    // Fetch journal entries from firebase
    fetchJournalEntries = ({ journalRef, currentUser }) => {
        let journalEntryHolder = [];

        journalRef.child(currentUser.uid).once("value", journalEntries => {
            journalEntries.forEach(journalEntry => {
                let key = journalEntry.val().key;
                let title = journalEntry.val().title;
                let text = journalEntry.val().text;
                let createdAt = journalEntry.val().createdAt;

                journalEntryHolder.push({ key, title, text, createdAt });
            });
            this.setState({
                journalEntries: journalEntryHolder
            });
        });
    };

    // Creates a new journal entry in firebase
    createNewJournalEntry = ({ journalRef, currentUser }) => {
        let createdAt = moment().valueOf();
        let pushRef = journalRef.child(currentUser.uid);

        pushRef.push().then(journalEntry => {
            pushRef
                .child(journalEntry.key)
                .set({
                    title: "no title",
                    createdAt: createdAt,
                    text: "no text",
                    key: journalEntry.key
                })
                .catch(error => {
                    console.error(error);
                });
        });
    };

    generateJournalEntryRoutes = ({ journalEntries }) =>
        journalEntries.map(journalEntry => (
            <Route
                key={journalEntry.key}
                path={`/journal/${journalEntry.key}`}
                render={() => <EntryField journalEntry={journalEntry} />}
            />
        ));

    render() {
        const { journalEntries } = this.state;

        return journalEntries ? (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Button
                            onClick={() =>
                                this.createNewJournalEntry(this.state)
                            }
                        >
                            Add entry
                        </Button>
                        <EntryList journalEntries={journalEntries} />
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {this.generateJournalEntryRoutes(this.state)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        ) : (
            "loading "
        );
    }
}

export default Journal;
