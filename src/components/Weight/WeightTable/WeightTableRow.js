// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { TableRow, TableCell } from "@material-ui/core";

// Icon Imports
import DeleteIcon from "@material-ui/icons/Delete";

class WeightTableRow extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight-entries"),

        // Props
        weightEntry: this.props.weightEntry,
        firstWeightEntry: this.props.firstWeightEntry
    };

    static getDerivedStateFromProps(props) {
        return {
            weightEntry: props.weightEntry,
            firstWeightEntry: props.firstWeightEntry
        };
    }

    // Calculate the difference between todays weight and previous weight entry
    calcWeightDif = (currentWeight, entryForComparison) => {
        let weightDif = (currentWeight - entryForComparison).toFixed(2);

        return (weightDif <= 0 ? "" : "+") + weightDif;
    };

    // Remove weight entry from firebase
    removeWeightEntry = ({ weightRef, currentUser, weightEntry }) => {
        weightRef
            .child(`${currentUser.uid}/${weightEntry.key}`)
            .remove()
            .catch(error => console.error(error));
    };

    // Determine row color based on weight difference from previous day
    determineDayToDayDifference = ({ weightEntry }) => {
        if (weightEntry.y < weightEntry.previousWeight) {
            return "weight-table-row-green";
        } else {
            return "weight-table-row-red";
        }
    };

    // If the weight difference is desireable (set in settings) set the background to gree, else red
    determineDayToStartDifference = ({ weightEntry, firstWeightEntry }) => {
        if (weightEntry.y < firstWeightEntry) {
            return "weight-table-row-green";
        } else {
            return "weight-table-row-red";
        }
    };

    render() {
        const { weightEntry, firstWeightEntry } = this.state;

        return (
            <TableRow>
                <TableCell>
                    <DeleteIcon
                        onClick={() => this.removeWeightEntry(this.state)}
                    />
                </TableCell>
                <TableCell align="right">{weightEntry.x}</TableCell>
                <TableCell align="right">
                    {parseFloat(weightEntry.y).toFixed(2)}
                </TableCell>
                <TableCell
                    align="right"
                    className={this.determineDayToDayDifference(this.state)}
                >
                    {this.calcWeightDif(
                        weightEntry.y,
                        weightEntry.previousWeight
                    )}
                </TableCell>
                <TableCell
                    align="right"
                    className={this.determineDayToStartDifference(this.state)}
                >
                    {this.calcWeightDif(weightEntry.y, firstWeightEntry)}
                </TableCell>
            </TableRow>
        );
    }
}

export default WeightTableRow;
