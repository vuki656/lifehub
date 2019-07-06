// Object Imports
import React from "react";

// Destructured Imports
import { List } from "semantic-ui-react";
import { Link } from "react-router-dom";

// Helper Imports
import { formatMoment } from "../../helpers/Global";

class EntryList extends React.Component {
    state = {
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
            <List.Item
                as={Link}
                to={`/journal/${journalEntry.key}`}
                key={journalEntry.key}
            >
                <List.Icon name="book" size="small" verticalAlign="middle" />
                <List.Content>
                    <List.Header>{journalEntry.title}</List.Header>
                    <List.Description>
                        <p>
                            Created at:{" "}
                            {formatMoment(journalEntry.createdAt, "DD/MM/YYYY")}
                        </p>
                    </List.Description>
                </List.Content>
            </List.Item>
        ));
    };
    render() {
        return (
            <List divided relaxed>
                {this.displayJournalEntryList(this.state)}
            </List>
        );
    }
}

export default EntryList;
