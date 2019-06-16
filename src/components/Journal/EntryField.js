import React from "react";
import firebase from "../../firebase/Auth";
import DatePicker from "react-datepicker";
import moment from "moment";

import { Segment, TextArea, Form, Button, Input } from "semantic-ui-react";

class EntryField extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        journalRef: firebase.database().ref("journal-entries"),

        newJournalEntryTitle: this.props.journalEntry.title,
        newJournalEntryText: this.props.journalEntry.text,
        newJournalEntryCreatedDate: this.props.journalEntry.createdAt,
        journalEntry: this.props.journalEntry
    };

    // Get parent props -> causes re-render
    static getDerivedStateFromProps(props) {
        return {
            journalEntry: props.journalEntry
        };
    }

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Send edited journal entry title to firebase and rerender
    handleJournalEntryChanges = ({
        journalEntry,
        journalRef,
        currentUser,
        newJournalEntryTitle,
        newJournalEntryText,
        newJournalEntryCreatedDate
    }) => {
        journalRef
            .child(`${currentUser.uid}/${journalEntry.key}`)
            .update({
                title: newJournalEntryTitle,
                text: newJournalEntryText,
                createdAt: newJournalEntryCreatedDate
            })
            .catch(error => console.error(error));
    };

    // Remove journal entry in firebase
    deleteJournalEntry = ({ journalEntry, journalRef, currentUser }) => {
        journalRef
            .child(`${currentUser.uid}/${journalEntry.key}`)
            .remove()
            .catch(error => console.error(error));
    };

    handleDateChange = newCreatedAtDate => {
        this.setState({ newJournalEntryCreatedDate: newCreatedAtDate });
    };

    render() {
        const { journalEntry, newJournalEntryCreatedDate } = this.state;

        return (
            <React.Fragment>
                <Segment>
                    <Input
                        defaultValue={journalEntry.title}
                        name={"newJournalEntryTitle"}
                        onChange={this.handleChange}
                    />
                </Segment>
                <Segment>
                    <DatePicker
                        selected={moment(newJournalEntryCreatedDate).toDate()}
                        dateFormat="dd/MM/yyyy"
                        timeCaption="time"
                        onChange={this.handleDateChange}
                    />
                </Segment>
                <Segment style={{ minHeight: 200 }}>
                    <Form>
                        <TextArea
                            rows={10}
                            name={"newJournalEntryText"}
                            style={{ minHeight: 300 }}
                            defaultValue={journalEntry.text}
                            onChange={this.handleChange}
                        />
                    </Form>
                </Segment>
                <Segment>
                    <Button
                        onClick={() =>
                            this.handleJournalEntryChanges(this.state)
                        }
                    >
                        Save Changes
                    </Button>
                    <Button onClick={() => this.deleteJournalEntry(this.state)}>
                        Delete Entry
                    </Button>
                </Segment>
            </React.Fragment>
        );
    }
}

export default EntryField;
