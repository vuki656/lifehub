// Object Imports
import React from "react";
import moment from "moment";
import firebase from "../../firebase/Auth";

// Destructured Imports
import { Form, Button, Message, Popup } from "semantic-ui-react";

class EnterWeightPop extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight-entries"),
        weight: "",
        currentDay: moment().valueOf(),
        error: "",
        isPopOpen: false
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Check if weight is valid
    checkWeightFormat = weight => {
        return this.checkIfWeightExists(weight) &&
            this.handleNumberCheck(weight)
            ? true
            : false;
    };

    // Checks if weight exists
    checkIfWeightExists = weight => {
        if (weight) {
            this.setState({ error: "" });
            return true;
        } else {
            this.setState({ error: "Please enter a number" });
            return false;
        }
    };

    // Checks the weight format
    handleNumberCheck = weight => {
        const regEx = /^0$|^[1-9]\d*$|^\.\d+$|^0\.\d*$|^[1-9]\d*\.\d*$/;

        if (regEx.test(weight)) {
            this.setState({ error: "" });
            return true;
        } else {
            this.setState({
                error:
                    "Wrong format. Weight can only be a whole number or a decimal with 2 decimal places"
            });
            return false;
        }
    };

    // Sends the weight and date object to firebase
    handleSubmit = ({ weight, currentDay, weightRef, currentUser }) => {
        let pushRef = weightRef.child(currentUser.uid);

        if (this.checkWeightFormat(weight)) {
            pushRef
                .child(`${currentUser.uid}`)
                .push()
                .then(weightEntry => {
                    pushRef
                        .child(weightEntry.key)
                        .set({
                            weight: weight,
                            date: currentDay,
                            key: weightEntry.key
                        })
                        .catch(err => {
                            console.error(err);
                        });
                });

            this.clearForm();
        }
    };

    handleWeightEntrySave = () => {
        this.handleSubmit(this.state);
        if (!this.state.error) {
            this.togglePopup();
        }
    };

    // CLear the form
    clearForm = () => {
        this.setState({ weight: "" });
    };

    togglePopup = () => {
        this.setState({ isPopOpen: !this.state.isPopOpen });
    };

    handleWeightEntryCancel = () => {
        this.setState({ weight: "" });
        this.togglePopup();
    };

    render() {
        const { weight, error, isPopOpen } = this.state;

        return (
            <React.Fragment>
                <p className="title">
                    Weight Entry Table{" "}
                    <Popup
                        basic
                        open={isPopOpen}
                        flowing
                        on="click"
                        trigger={
                            <Button
                                className="button-secondary mar-left-1-rem"
                                onClick={this.togglePopup}
                            >
                                Add Entry
                            </Button>
                        }
                    >
                        <p className="subtitle">Enter Your Weight</p>
                        {error !== "" && (
                            <p className="weight-entry-pop-error">{error}</p>
                        )}

                        <Form>
                            <Form.Group widths="equal">
                                <Form.Input
                                    fluid
                                    name="weight"
                                    value={weight}
                                    placeholder="Weight"
                                    type="float"
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Button.Group>
                                <Button
                                    onClick={this.handleWeightEntrySave}
                                    className="button-primary"
                                >
                                    Submit
                                </Button>
                                <Button
                                    onClick={this.handleWeightEntryCancel}
                                    className="button-secondary"
                                >
                                    Cancel
                                </Button>
                            </Button.Group>
                        </Form>
                    </Popup>
                </p>
            </React.Fragment>
        );
    }
}

export default EnterWeightPop;
