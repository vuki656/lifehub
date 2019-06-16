import React from "react";

import { Segment, TextArea, Form } from "semantic-ui-react";

import { formatMoment } from "../../helpers/Global";

class EntryField extends React.Component {
    state = {
        journalEntry: this.props.journalEntry
    };

    render() {
        const { journalEntry } = this.state;

        return (
            <React.Fragment>
                <Segment>{journalEntry.title}</Segment>
                <Segment>
                    {formatMoment(journalEntry.createdAt, "DD/MM/YYYY")}
                </Segment>
                <Segment style={{ minHeight: 200 }}>
                    <Form>
                        <TextArea
                            rows={10}
                            style={{ minHeight: 300 }}
                            value={journalEntry.text}
                        />
                    </Form>
                </Segment>
            </React.Fragment>
        );
    }
}

export default EntryField;
