// Object Imports
import React from "react";

// Destructured Imports
import { Table, Popup, Icon } from "semantic-ui-react";

// Component Imports
import WeightTableRow from "./WeightTableRow";

class WeightTable extends React.Component {
    state = {
        weightList: this.props.weightList,
        firstWeightEntry: this.props.firstWeightEntry
    };

    static getDerivedStateFromProps(props) {
        return {
            weightList: props.weightList,
            firstWeightEntry: props.firstWeightEntry
        };
    }

    // Render weight rows with data
    renderTableRows = ({ weightList, firstWeightEntry }) => {
        return weightList.map(weightEntry => (
            <WeightTableRow
                weightEntry={weightEntry}
                firstWeightEntry={firstWeightEntry}
                key={weightEntry.key}
            />
        ));
    };

    render() {
        const { weightList } = this.state;

        return (
            weightList && (
                <Table className="weight-table" celled fixed singleLine>
                    <Table.Header>
                        <Table.Row className="table-header">
                            <Table.HeaderCell>Remove</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Weight (KG)</Table.HeaderCell>
                            <Table.HeaderCell>
                                Loss/Gain
                                <Popup
                                    basic
                                    trigger={
                                        <Icon
                                            circular
                                            name="info"
                                            size="small"
                                        />
                                    }
                                >
                                    Compared to day before
                                </Popup>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Total Loss/Gain
                                <Popup
                                    basic
                                    trigger={
                                        <Icon
                                            circular
                                            name="info"
                                            size="small"
                                        />
                                    }
                                >
                                    Compared to first weight entry
                                </Popup>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>{this.renderTableRows(this.state)}</Table.Body>
                </Table>
            )
        );
    }
}

export default WeightTable;
