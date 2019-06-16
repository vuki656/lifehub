import React from "react";
import moment from "moment";

import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

class EntryList extends React.Component {
    state = {
        journalEntries: this.props.journalEntries
    };

    // Get parent props -> causes re-render
    static getDerivedStateFromProps(props) {
        return {
            journalEntries: props.journalEntries
        };
    }

    // Display list of journal entries
    displayJournalEntryList = ({ journalEntries }) => {
        return journalEntries.map(journalEntry => (
            <Menu.Item
                as={Link}
                to={`/journal/${journalEntry.key}`}
                key={journalEntry.key}
            >
                <p> {moment(journalEntry.createdAt).format("DD/MM/YYYY")}</p>
            </Menu.Item>
        ));
    };
    render() {
        return (
            <React.Fragment>
                <Menu vertical>{this.displayJournalEntryList(this.state)}</Menu>
            </React.Fragment>
        );
    }
}

export default EntryList;
