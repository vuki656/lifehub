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
        this.addListeners(this.state);
    }

    addListeners = () => {
        this.addWeightListener(this.state);
        this.addRemoveWeightListener(this.state);
    };

    // Listen for new weight inputs
    addWeightListener = ({ currentUser, weightRef }) => {
        weightRef.child(currentUser.uid).on("child_added", () => {
            this.fetchWeightData();
        });
    };

    // Listen for new weight deletions
    addRemoveWeightListener = ({ currentUser, weightRef }) => {
        weightRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchWeightData();
        });
    };

    // Fetches weight data from firebase
    fetchWeightData = () => {
        const { currentUser, weightRef } = this.state;
        let weightHolder = [];
        let previousWeight = "";

        weightRef.child(currentUser.uid).once("value", snapshot => {
            snapshot.forEach(child => {
                let date = child.val().date;
                let weight = child.val().weight;
                let key = child.val().key;

                weightHolder.push({ date, weight, previousWeight, key });
                previousWeight = weight; // Store the previous weight for weight diff column
            });

            // Grab the first weight entry
            let firstWeightEntry = 0;
            weightRef
                .child(currentUser.uid)
                .orderByKey()
                .limitToFirst(1)
                .once("value", snap => {
                    snap.forEach(child => {
                        firstWeightEntry = child.val().weight;
                    });
                });

            this.setState({
                weightList: weightHolder,
                firstWeightEntry: firstWeightEntry
            });
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
