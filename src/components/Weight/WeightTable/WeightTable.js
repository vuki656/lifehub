// Object Imports
import React from "react";

// Destructured Imports
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@material-ui/core";

// Icon Imports

// Component Imports
import WeightTableRow from "./WeightTableRow";

class WeightTable extends React.Component {
    state = {
        // Props
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Options</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Weight</TableCell>
                            <TableCell align="right">Loss/Gain</TableCell>
                            <TableCell align="right">Total Loss/Gain</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{this.renderTableRows(this.state)}</TableBody>
                </Table>
            )
        );
    }
}

export default WeightTable;
