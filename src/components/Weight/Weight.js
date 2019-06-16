import React from "react";
import firebase from "../../firebase/Auth";

import { Grid } from "semantic-ui-react";

import EnterWeightForm from "./EnterWeightForm";
import WeightTable from "./WeightTable";
import WeightChart from "./WeightChart";

class Weight extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight-entries"),
        weightList: [],
        firstWeightEntry: 0
    };

    componentDidMount() {
        this._isMounted = true;

        this.fetchWeightData(this.state);
        this.addListeners(this.state);
    }

    componentWillUnmount() {
        this.removeListeners(this.state);

        this._isMounted = false;
    }

    addListeners = () => {
        this.addWeightListener(this.state);
        this.addRemoveWeightListener(this.state);
        this.addUpdateWeightListener(this.state);
    };

    removeListeners = ({ weightRef, currentUser }) => {
        weightRef.child(`${currentUser.uid}`).off();
    };

    // Listen for new weight inputs
    addWeightListener = ({ currentUser, weightRef }) => {
        weightRef.child(currentUser.uid).on("child_added", () => {
            this.fetchWeightData(this.state);
        });
    };

    // Listen for new weight deletions
    addRemoveWeightListener = ({ currentUser, weightRef }) => {
        weightRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchWeightData(this.state);
        });
    };

    // Listen for new weight updates
    addUpdateWeightListener = ({ currentUser, weightRef }) => {
        weightRef.child(currentUser.uid).on("child_changed", () => {
            this.fetchWeightData(this.state);
        });
    };

    // Fetches weight data from firebase
    fetchWeightData = ({ currentUser, weightRef }) => {
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
                        <EnterWeightForm />
                        <p>Data Entry History</p>
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
