import React from "react";
import firebase from "firebase";

import { Checkbox, Grid, Button, Form } from "semantic-ui-react";

class TodoCard extends React.Component {
    state = {
        todo: "",
        category: this.props.category,
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
        currentDay: this.props.currentDay,
        monthObjectList: this.props.monthObjectList
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = () => {
        const { todo, category, currentUser, todoRef, currentDay } = this.state;

        if (todo) {
            todoRef
                .child(`${currentUser.uid}/${currentDay}/${[category]}`)
                .push(todo)
                .catch(err => {
                    console.error(err);
                });
            this.clearForm();
        }
    };

    clearForm = () => {
        this.setState({ todo: "" });
    };

    render() {
        const { todo } = this.state;

        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row>
                        <Checkbox label="This is a todo" />
                    </Grid.Row>
                    <Grid.Row>
                        <Checkbox label="This is a todo" />
                    </Grid.Row>
                    <Grid.Row>
                        <Form.Group widths="equal">
                            <Form.Input
                                name="todo"
                                value={todo}
                                placeholder="todo"
                                type="float"
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Button onClick={this.handleSubmit}>Submit</Button>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

export default TodoCard;
