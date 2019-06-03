import React from "react";
import moment from "moment";

import { Table, Popup, Icon } from "semantic-ui-react";

class WeightTable extends React.Component {
    // Convert the unix timestamp to normal date format 20/03/2019
    unixDateToNormal = date => moment.unix(date).format("DD/MM/YYYY");

    // Calculate the difference between todays weight and previous weight entry
    calcWeightDif = (currentWeight, entryForComparison) => {
        let weightDif = currentWeight - entryForComparison;
        return (weightDif <= 0 ? "" : "+") + weightDif;
    };

    // Render weight rows with data
    renderTableRows = () => {
        const { weightList, firstWeightEntry } = this.props;

        return weightList.map((weightEntry, index) => (
            <Table.Row key={index}>
                <Table.Cell>
                    {this.unixDateToNormal(weightEntry.date)}
                </Table.Cell>
                <Table.Cell>{weightEntry.weight}</Table.Cell>
                <Table.Cell>
                    {this.calcWeightDif(
                        weightEntry.weight,
                        weightEntry.previousWeight
                    )}
                </Table.Cell>
                <Table.Cell>
                    {this.calcWeightDif(weightEntry.weight, firstWeightEntry)}
                </Table.Cell>
            </Table.Row>
        ));
    };

    render() {
        return (
            <Table celled fixed singleLine>
                <Table.Header>
                    <Table.Row>
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
