import React from "react";
import moment from "moment";
import firebase from "../../firebase/Auth";

import { Form, Button, Message } from "semantic-ui-react";

class EnterWeightForm extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight"),
        weight: "",
        date: moment().unix(),
        error: ""
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Does weight checks
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

    // Sends the weight and date object to database
    handleSubmit = () => {
        const { weight, date, weightRef, currentUser } = this.state;

        if (this.checkWeightFormat(weight)) {
            weightRef
                .child(currentUser.uid)
                .push()
                .set({ weight: weight, date: date })
                .catch(err => {
                    console.error(err);
                });
            this.clearForm();
        }
    };

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
