import React from "react";
import moment from "moment";
import firebase from "../../firebase/Auth";

import { Form, Button } from "semantic-ui-react";

class EnterWeightForm extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight"),
        weight: "",
        date: moment().unix()
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleNumberCheck = weight => {
        const regEx = /^0$|^[1-9]\d*$|^\.\d+$|^0\.\d*$|^[1-9]\d*\.\d*$/;

        if (regEx.test(weight)) {
            return true;
        } else {
            return false;
        }
    };

    // Sends the weight and date object to database
    handleWeightSubmit = () => {
        const { weight, date, weightRef, currentUser } = this.state;

        if (weight && this.handleNumberCheck(weight)) {
            weightRef
                .child(currentUser.uid)
                .push()
                .set({ weight: weight, date: date })
                .catch(err => {
                    console.error(err);
                });
            this.clearForm();
        } else {
            console.log("error");
        }
    };

    clearForm = () => {
        this.setState({ weight: "" });
    };

    handleSubmit = () => {
        this.handleWeightSubmit();
    };

    render() {
        const { weight } = this.state;

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
            </React.Fragment>
        );
    }
}

export default EnterWeightForm;
