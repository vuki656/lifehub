// // Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Icon, Segment, Grid, Button, Input } from "semantic-ui-react";

class AddTodoCardButton extends React.Component {
    state = {
        todoCardRef: firebase.database().ref("todo-cards"),
        currentUser: firebase.auth().currentUser,
        displayOptions: false,
        todoCardName: ""
    };

    // Handle new todo card save in firebase
    handleTodoCardSave = () => {
        this.setState({ displayOptions: false });
        this.saveTodoCard(this.state);
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

    // Clear the name input field
    clearInputField = () => {
        this.setState({ todoCardName: "" });
    };

    // Toggle card name display
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
                {!displayOptions && (
                    <Segment
                        className="add-todo-card"
                        onClick={this.toggleTodoCardOptions}
                        placeholder
                    >
                        <Button icon className="button-primary">
                            <Icon name="add" />
                        </Button>
                    </Segment>
                )}
                {displayOptions && (
                    <Segment className="add-todo-card-input-section">
                        <p className="add-todo-card-text">Enter Card Name</p>
                        <Input
                            value={todoCardName}
                            name={"todoCardName"}
                            onChange={this.handleChange}
                            placeholder="Enter Card Name"
                            className="add-todo-card-input"
                        />
                        <Button.Group>
                            <Button
                                onClick={this.handleTodoCardSave}
                                className="button-primary add-todo-card-button"
                            >
                                Save
                            </Button>
                            <Button
                                onClick={this.toggleTodoCardOptions}
                                className="button-secondary add-todo-card-button"
                            >
                                Cancel
                            </Button>
                        </Button.Group>
                    </Segment>
                )}
            </Grid.Column>
        );
    }
}

export default AddTodoCardButton;
