// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";

// Destructured Imports
import { Grid } from "@material-ui/core";

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
        // Firebase
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight-entries"),

        // Base
        weightList: [],
        firstWeightEntry: 0,
        dayRange: 30
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchWeightData(this.state);
        this.activateListeners(this.state);
    }

    componentWillUnmount() {
        this.deactivateListeners();
        this._isMounted = false;
    }

    // Activate database listeners
    activateListeners = () => {
        this.activateWeightListener(this.state);
        this.activateRemoveWeightListener(this.state);
        this.activateUpdateWeightListener(this.state);
    };

    // Deactivate database listeners
    deactivateListeners = () => {
        this.deactivateWeightListener(this.state);
    };

    // Deactivate weight ref listener
    deactivateWeightListener = ({ weightRef, currentUser }) => {
        weightRef.child(`${currentUser.uid}`).off();
    };

    // Listen for new weight inputs
    activateWeightListener = ({ currentUser, weightRef }) => {
        weightRef.child(currentUser.uid).on("child_added", () => {
            this.fetchWeightData(this.state);
        });
    };

    // Listen for new weight deletions
    activateRemoveWeightListener = ({ currentUser, weightRef }) => {
        weightRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchWeightData(this.state);
        });
    };

    // Listen for new weight updates
    activateUpdateWeightListener = ({ currentUser, weightRef }) => {
        weightRef.child(currentUser.uid).on("child_changed", () => {
            this.fetchWeightData(this.state);
        });
    };

    // Fetches weight data from firebase
    fetchWeightData = ({ currentUser, weightRef }) => {
        let weightHolder = [];
        let previousWeight = "";
        let firstWeightEntry = 0;
        let firstEntryGotten = false;

        weightRef.child(currentUser.uid).once("value", weightEntries => {
            weightEntries.forEach(weightEntry => {
                let date = weightEntry.val().date;
                let weight = weightEntry.val().weight;
                let key = weightEntry.val().key;

                if (!firstEntryGotten) {
                    firstWeightEntry = weightEntry.val().weight;
                    firstEntryGotten = true;
                }

                weightHolder.push({
                    x: date,
                    y: weight,
                    previousWeight,
                    key
                });
                previousWeight = weight; // Store the previous weight for weight diff column
            });

            let formatedWeightList = this.formatWeightList(weightHolder);

            this._isMounted &&
                this.setState({
                    weightList: formatedWeightList,
                    firstWeightEntry: firstWeightEntry
                });
        });
    };

    // Sort than format object dates
    formatWeightList = weightHolder => {
        // Sort the data by date DESC
        weightHolder.sort((a, b) => (a.x > b.x ? 1 : -1));

        return weightHolder.map(weightEntry => ({
            x: formatMoment(weightEntry.x, "DD/MM/YY"),
            y: weightEntry.y,
            previousWeight: weightEntry.previousWeight,
            key: weightEntry.key
        }));
    };

    render() {
        const { weightList, firstWeightEntry } = this.state;

        return (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
            >
                <Grid item xs={12} style={{ width: "100%" }}>
                    <WeightChart weightList={weightList} />
                </Grid>
                <Grid item xs={12}>
                    <EnterWeightPop />
                    <WeightTable
                        weightList={weightList}
                        firstWeightEntry={firstWeightEntry}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default Weight;
