import React from "react";
import firebase from "../../firebase/Auth";
import moment from "moment";

import { Table, Popup, Icon } from "semantic-ui-react";

class WeightTable extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight"),
        weightList: ["marko"]
    };

    componentDidMount() {
        this.fetchWeightData();
        this.addWeightListener(this.state);
    }

    // Add the new weight to state weightList array
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

        firebase
            .database()
            .ref()
            .child("weight/" + currentUser.uid)
            .once("value", snapshot => {
                snapshot.forEach(child => {
                    let date = child.val().date;
                    let weight = child.val().weight;
                    weightHolder.push({ date, weight });
                });
                this.setState({ weightList: weightHolder });
                console.log(this.state.weightList);
            });
    };

    unixDateToNormal = date => moment.unix(date).format("DD/MM/YYYY");

    renderTableRows = () =>
        this.state.weightList.map((weightEntry, index) => (
            <Table.Row key={index}>
                <Table.Cell>
                    {this.unixDateToNormal(weightEntry.date)}
                </Table.Cell>
                <Table.Cell>{weightEntry.weight}</Table.Cell>
                <Table.Cell>{weightEntry.weight}</Table.Cell>
                <Table.Cell>{weightEntry.weight}</Table.Cell>
            </Table.Row>
        ));

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
