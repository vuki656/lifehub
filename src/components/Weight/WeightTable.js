import React from "react";
import firebase from "../../firebase/Auth";
import moment from "moment";

import { Table, Popup, Icon } from "semantic-ui-react";

class WeightTable extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight"),
        weightList: [],
        firstWeightEntry: 0
    };

    componentDidMount() {
        this.fetchWeightData();
        this.addWeightListener(this.state);
    }

    // Listen for new weight inputs and add them to state
    addWeightListener({ currentUser }) {
        let weightHolder = [];

        firebase
            .database()
            .ref()
            .child("weight/" + currentUser.uid)
            .on("child_added", snapshot => {
                let date = snapshot.val().date;
                let weight = snapshot.val().weight;
                weightHolder.push({ date, weight });
                this.setState({ weightList: weightHolder });
            });
    }

    // Fetches weight data from firebase
    fetchWeightData = () => {
        const { currentUser } = this.state;
        let weightHolder = [];
        let previousWeight = "";

        firebase
            .database()
            .ref()
            .child("weight/" + currentUser.uid)
            .once("value", snapshot => {
                snapshot.forEach(child => {
                    let date = child.val().date;
                    let weight = child.val().weight;
                    weightHolder.push({ date, weight, previousWeight });
                    previousWeight = weight;
                });
                this.setState({ weightList: weightHolder });

                // Grab the first weight entry
                let firstWeightEntry = this.state.weightList[0];
                this.setState({ firstWeightEntry: firstWeightEntry.weight });
            });
    };

    // Convert the unix timestamp to normal date format 20/03/2019
    unixDateToNormal = date => moment.unix(date).format("DD/MM/YYYY");

    // Calculate the difference between todays weight and previous weight entry
    calcWeightDif = (currentWeight, entryForComparison) => {
        let weightDif = currentWeight - entryForComparison;

        return (weightDif <= 0 ? "" : "+") + weightDif;
    };

    // Render weight data
    renderTableRows = () => {
        const { weightList, firstWeightEntry } = this.state;

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
