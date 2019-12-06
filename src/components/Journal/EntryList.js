// Object Imports
import React from "react";

// Destructured Imports
import { List } from "@material-ui/core";

// Component Imports
import EntryListItem from "./EntryListItem";

class EntryList extends React.Component {
    state = {
        // Base
        journalEntries: this.props.journalEntries
    };

    static getDerivedStateFromProps(props) {
        return {
            journalEntries: props.journalEntries
        };
    }

    // Display list of journal entries
    displayJournalEntryList = ({ journalEntries }) => {
        return journalEntries.map(journalEntry => (
            <EntryListItem key={journalEntry.key} journalEntry={journalEntry} />
        ));
    };

    render() {
        return <List>{this.displayJournalEntryList(this.state)}</List>;
    }
}

export default EntryList;
