import React from "react";
import { formatMoment } from "../../helpers/Global";

class EntryField extends React.Component {
    state = {
        journalEntry: this.props.journalEntry
    };

    render() {
        const { journalEntry } = this.state;

        return (
            <div>
                <p>{journalEntry.title}</p>
                <p>{formatMoment(journalEntry.createdAt, "DD/MM/YYYY")}</p>
                <p>{journalEntry.text}</p>
            </div>
        );
    }
}

export default EntryField;
