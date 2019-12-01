// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Table, Icon } from "semantic-ui-react";

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
            <Table.Row>
                <Table.Cell>
                    <Icon
                        circular
                        name="delete"
                        size="small"
                        onClick={() => this.removeWeightEntry(this.state)}
                    />
                </Table.Cell>
                <Table.Cell>{weightEntry.x}</Table.Cell>
                <Table.Cell>{parseFloat(weightEntry.y).toFixed(2)}</Table.Cell>
                <Table.Cell
                    className={this.determineDayToDayDifference(this.state)}
                >
                    {this.calcWeightDif(
                        weightEntry.y,
                        weightEntry.previousWeight
                    )}
                </Table.Cell>
                <Table.Cell
                    className={this.determineDayToStartDifference(this.state)}
                >
                    {this.calcWeightDif(weightEntry.y, firstWeightEntry)}
                </Table.Cell>
            </Table.Row>
        );
    }
}

export default WeightTableRow;
