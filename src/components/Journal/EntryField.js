// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";
import DatePicker from "react-datepicker";
import moment from "moment";

// Destructured Imports
import { TextArea, Form, Button, Input } from "semantic-ui-react";

class EntryField extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        journalRef: firebase.database().ref("journal-entries"),

        // Props
        newJournalEntryTitle: this.props.journalEntry.title,
        newJournalEntryText: this.props.journalEntry.text,
        newJournalEntryCreatedDate: this.props.journalEntry.createdAt,
        journalEntry: this.props.journalEntry
    };

    static getDerivedStateFromProps(props) {
        return {
            journalEntry: props.journalEntry
        };
    }

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

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { journalEntry, newJournalEntryCreatedDate } = this.state;

        return (
            <div className="journal-entry-fields-section">
                <p className="subtitle">Title</p>
                <Input
                    className="mar-bot-1-rem"
                    defaultValue={journalEntry.title}
                    name={"newJournalEntryTitle"}
                    onChange={this.handleChange}
                />
                <p className="subtitle">Date</p>
                <DatePicker
                    className="datepicker-box mar-bot-1-rem"
                    selected={moment(newJournalEntryCreatedDate).toDate()}
                    dateFormat="dd/MM/yyyy"
                    timeCaption="time"
                    onChange={this.handleDateChange}
                />
                <p className="subtitle">Text</p>
                <Form style={{ minHeight: 200 }}>
                    <TextArea
                        className="mar-bot-1-rem border-radius-0"
                        rows={10}
                        name={"newJournalEntryText"}
                        style={{ minHeight: 300 }}
                        defaultValue={journalEntry.text}
                        onChange={this.handleChange}
                    />
                </Form>
                <Button.Group>
                    <Button
                        className="button-primary"
                        onClick={() =>
                            this.handleJournalEntryChanges(this.state)
                        }
                    >
                        Save Changes
                    </Button>
                    <Button
                        className="button-secondary"
                        onClick={() => this.deleteJournalEntry(this.state)}
                    >
                        Delete Entry
                    </Button>
                </Button.Group>
            </div>
        );
    }
}

export default EntryField;
