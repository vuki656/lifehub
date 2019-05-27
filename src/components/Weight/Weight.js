import React from "react";
import firebase from "../../firebase/Auth";

import { Grid } from "semantic-ui-react";

import EnterWeightForm from "./EnterWeightForm";
import WeightTable from "./WeightTable";
import WeightChart from "./WeightChart";

class Weight extends React.Component {
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
                // Update the state with new weight list
                this.setState({ weightList: weightHolder });

                // Grab the first weight entry
                let firstWeightEntry = this.state.weightList[0];
                if (firstWeightEntry) {
                    this.setState({
                        firstWeightEntry: firstWeightEntry.weight
                    });
                }
            });
    };

    render() {
        const { weightList, firstWeightEntry } = this.state;

        return (
            <Grid columns="equal">
                <Grid.Row>
                    <Grid.Column>
                        <p>Data Entry History</p>
                        <EnterWeightForm />
                        <WeightTable
                            weightList={weightList}
                            firstWeightEntry={firstWeightEntry}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <WeightChart weightList={weightList} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Weight;
