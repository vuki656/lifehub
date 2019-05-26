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

    // Possibly good regex
    // handleNumberCheck = weight => {
    //     if (/^-?\d+(\.?\d+)?$/.test(weight)) {
    //         console.log("good");
    //     }
    // };

    // Sends the weight and date object to database
    handleWeightSubmit = () => {
        const { weight, date, weightRef, currentUser } = this.state;

        weightRef
            .child(currentUser.uid)
            .push()
            .set({ weight: weight, date: date })
            .catch(err => {
                console.error(err);
            });
    };

    clearForm = () => {
        this.setState({ weight: "" });
    };

    handleSubmit = () => {
        this.handleWeightSubmit();
        this.clearForm();
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
                            required
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
