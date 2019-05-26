import React from "react";
import firebase from "../../firebase/Auth";

import { Table } from "semantic-ui-react";

class WeightTable extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight"),
        weightList: [],
        loading: true
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const { currentUser } = this.state;
        let tempWeightHolder = [];

        firebase
            .database()
            .ref()
            .child("weight/" + currentUser.uid)
            .once("value", snapshot => {
                snapshot.forEach(child => {
                    var date = child.val().date;
                    var weight = child.val().weight;
                    tempWeightHolder.push({ date, weight });
                });
                this.setState({ weightList: tempWeightHolder });
            });
    };

    render() {
        const { loading } = this.state;

        return (
            <Table celled fixed singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Weight (KG)</Table.HeaderCell>
                        <Table.HeaderCell>Loss/Gain</Table.HeaderCell>
                        <Table.HeaderCell>Total Loss/Gain</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.state.weightList.map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{item.date}</Table.Cell>
                            <Table.Cell>{item.weight}</Table.Cell>
                            <Table.Cell negative>{item.date}</Table.Cell>
                            <Table.Cell>{item.weight}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }
}

export default WeightTable;
