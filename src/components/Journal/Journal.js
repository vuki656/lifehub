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

    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        journalRef: firebase.database().ref("journal-entries"),

        // Base
        journalEntries: null,
        activeEntry: ""
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchJournalEntries(this.state);
        this.activateListeners();
    }

    componentWillUnmount() {
        this.deactivateListeners();
        this._isMounted = false;
    }

    // Activate database listeners
    activateListeners = () => {
        this.activateJournalEntryListener(this.state);
        this.activateRemoveJournalEntryListener(this.state);
        this.activateUpdateJournalEntryListener(this.state);
    };

    // Deactivate database listeners
    deactivateListeners = () => {
        this.deactivateJournalListener(this.state);
    };

    // Deactivate journal ref listener
    deactivateJournalListener = ({ journalRef, currentUser }) => {
        journalRef.child(`${currentUser.uid}`).off();
    };

    // Listen for new journal inputs
    activateJournalEntryListener = ({ currentUser, journalRef }) => {
        journalRef.child(currentUser.uid).on("child_added", () => {
            this.fetchJournalEntries(this.state);
        });
    };

    // Listen for new journal deletions
    activateRemoveJournalEntryListener = ({ currentUser, journalRef }) => {
        journalRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchJournalEntries(this.state);
        });
    };

    // Listen for new journal updates
    activateUpdateJournalEntryListener = ({ currentUser, journalRef }) => {
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
                    title: "No title",
                    createdAt: createdAt,
                    text: "No text",
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
                <Grid.Row className="pad-bot-0">
                    <Grid.Column
                        width={3}
                        className="journal-entry-list-column"
                    >
                        <Button
                            className="button-primary width-100-pcnt mar-all-0"
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
