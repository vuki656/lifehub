// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Table, Icon } from "semantic-ui-react";

// Helper Imports
import { formatMoment } from "../../../helpers/Global";

class WeightTableRow extends React.Component {
    state = {
        weightRef: firebase.database().ref("weight-entries"),
        currentUser: firebase.auth().currentUser,

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
        let weightDif = currentWeight - entryForComparison;
        return (weightDif <= 0 ? "" : "+") + weightDif;
    };

    // Remove weight entry from firebase
    removeWeightEntry = ({ weightRef, currentUser, weightEntry }) => {
        weightRef
            .child(`${currentUser.uid}/${weightEntry.key}`)
            .remove()
            .catch(error => console.error(error));
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
                <Table.Cell>
                    {formatMoment(weightEntry.date, "DD/MM/YYYY")}
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
        );
    }
}

export default WeightTableRow;
