// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";

// Destructured Imports
import {
    Typography,
    TextareaAutosize,
    Input,
    Button,
    Grid
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

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

    // Send edited journal entry title to firebase and re-render
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

    // Handle date change
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
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={12}>
                    <Typography variant="h5">Title</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Input
                        defaultValue={journalEntry.title}
                        name={"newJournalEntryTitle"}
                        type={"text"}
                        onChange={this.handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">Date</Typography>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            autoOk
                            label="Date"
                            clearable
                            disablePast
                            value={moment(newJournalEntryCreatedDate).toDate()}
                            onChange={this.handleDateChange}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">Note</Typography>
                    <TextareaAutosize
                        defaultValue={journalEntry.text}
                        placeholder="Write your journal entry here"
                        name={"newJournalEntryText"}
                        onChange={this.handleChange}
                    />
                </Grid>
                <Grid
                    item
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    xs={12}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                            this.handleJournalEntryChanges(this.state)
                        }
                    >
                        Save Changes
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => this.deleteJournalEntry(this.state)}
                    >
                        Delete Entry
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default EntryField;
