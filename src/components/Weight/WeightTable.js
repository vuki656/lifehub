import React from "react";

import { Table, Popup, Icon } from "semantic-ui-react";

import WeightTableRow from "./WeightTableRow";

class WeightTable extends React.Component {
    // Render weight rows with data
    renderTableRows = () => {
        const { weightList, firstWeightEntry } = this.props;

        return weightList.map(weightEntry => (
            <WeightTableRow
                weightEntry={weightEntry}
                firstWeightEntry={firstWeightEntry}
                key={weightEntry.key}
            />
        ));
    };

    render() {
        return (
            <Table celled fixed singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Remove</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Weight (KG)</Table.HeaderCell>
                        <Table.HeaderCell>
                            Loss/Gain
                            <Popup
                                basic
                                trigger={
                                    <Icon circular name="info" size="small" />
                                }
                            >
                                Compared to day before
                            </Popup>
                        </Table.HeaderCell>
                        <Table.HeaderCell>Total Loss/Gain</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{this.renderTableRows()}</Table.Body>
            </Table>
        );
    }
}

export default WeightTable;
