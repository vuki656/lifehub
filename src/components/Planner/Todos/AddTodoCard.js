// // Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Icon, Segment, Grid, Button, Input } from "semantic-ui-react";

class AddTodoCard extends React.Component {
    state = {
        todoCardRef: firebase.database().ref("todo-cards"),
        currentUser: firebase.auth().currentUser,
        displayOptions: false,
        todoCardName: ""
    };

    // Save todo card in firebase
    saveTodoCard = ({ todoCardRef, currentUser, todoCardName }) => {
        if (todoCardName) {
            todoCardRef
                .push()
                .then(todo => {
                    todoCardRef.child(`${currentUser.uid}/${todo.key}`).update({
                        name: todoCardName,
                        key: todo.key
                    });
                })
                .then(this.clearInputField())
                .catch(err => {
                    console.error(err);
                });
        }
    };

    clearInputField = () => {
        this.setState({ todoCardName: "" });
    };

    toggleTodoCardOptions = () => {
        this.setState({ displayOptions: !this.state.displayOptions });
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { displayOptions, todoCardName } = this.state;

        return (
            <Grid.Column width={5}>
                <Segment className="add-todo-card-segment" placeholder>
                    {!displayOptions && (
                        <Button icon onClick={this.toggleTodoCardOptions}>
                            <Icon name="add" />
                        </Button>
                    )}
                    {displayOptions && (
                        <React.Fragment>
                            <Input
                                value={todoCardName}
                                name={"todoCardName"}
                                onChange={this.handleChange}
                                placeholder="Enter Card Name"
                            />
                            <Button.Group>
                                <Button
                                    onClick={() =>
                                        this.saveTodoCard(this.state)
                                    }
                                >
                                    Save
                                </Button>
                                <Button onClick={this.toggleTodoCardOptions}>
                                    Cancel
                                </Button>
                            </Button.Group>
                        </React.Fragment>
                    )}
                </Segment>
            </Grid.Column>
        );
    }
}

export default AddTodoCard;
