// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";

// Destructured Imports
import { Grid } from "semantic-ui-react";

// Component Imports
import EnterWeightPop from "./EnterWeightPop";
import WeightTable from "./WeightTable/WeightTable";
import WeightChart from "./WeightChart";

// Helper Imports
import { formatMoment } from "../../helpers/Global";

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

        weightRef.child(currentUser.uid).once("value", weightEntries => {
            weightEntries.forEach(weightEntry => {
                let date = formatMoment(weightEntry.val().date, "DD/MM/YY");
                let weight = weightEntry.val().weight;
                let key = weightEntry.val().key;

                weightHolder.push({
                    x: date,
                    y: weight,
                    previousWeight,
                    key
                });
                previousWeight = weight; // Store the previous weight for weight diff column
            });

            // Grab the first weight entry
            let firstWeightEntry = 0;
            weightRef
                .child(currentUser.uid)
                .orderByKey()
                .limitToFirst(1)
                .once("value", weightEntries => {
                    weightEntries.forEach(weightEntry => {
                        firstWeightEntry = weightEntry.val().weight;
                    });
                });

            // Sort the data by date ASC
            weightHolder.sort((a, b) => parseFloat(a.x) - parseFloat(b.x));

            this.setState({
                weightList: weightHolder,
                firstWeightEntry: firstWeightEntry
            });
        });
    };

    render() {
        const { weightList, firstWeightEntry } = this.state;
        // console.log("TCL: render -> weightList", weightList);

        return (
            <Grid columns="equal">
                <Grid.Row className="width-100-pcnt" style={{ height: 600 }}>
                    <WeightChart weightList={weightList} />
                </Grid.Row>
                <Grid.Row>
                    <EnterWeightPop />
                    <WeightTable
                        weightList={weightList}
                        firstWeightEntry={firstWeightEntry}
                    />
                </Grid.Row>
            </Grid>
        );
    }
}

export default Weight;
