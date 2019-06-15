import React from "react";
import moment from "moment";
import firebase from "../../firebase/Auth";

import { Form, Button, Message } from "semantic-ui-react";

class EnterWeightForm extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight"),
        weight: "",
        currentDay: moment().valueOf(),
        error: ""
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
    handleSubmit = () => {
        const { weight, currentDay, weightRef, currentUser } = this.state;
        let pushRef = weightRef.child(currentUser.uid);

        if (this.checkWeightFormat(weight)) {
            pushRef
                .child(`${currentUser.uid}`)
                .push()
                .then(snapshot => {
                    pushRef
                        .child(snapshot.key)
                        .set({
                            weight: weight,
                            date: currentDay,
                            key: snapshot.key
                        })
                        .catch(err => {
                            console.error(err);
                        });
                });

            this.clearForm();
        }
    };

    // CLear the form
    clearForm = () => {
        this.setState({ weight: "" });
    };

    render() {
        const { weight, error } = this.state;

        return (
            <React.Fragment>
                <Form>
                    <Form.Group widths="equal">
                        <Form.Input
                            fluid
                            name="weight"
                            label="Weight"
                            value={weight}
                            placeholder="Weight"
                            type="float"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Button onClick={this.handleSubmit}>Submit</Button>
                </Form>
                {error !== "" && (
                    <Message error header="Error" content={error} />
                )}
            </React.Fragment>
        );
    }
}

export default EnterWeightForm;
