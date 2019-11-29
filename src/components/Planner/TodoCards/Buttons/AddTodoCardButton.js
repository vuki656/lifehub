// // Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import {
    Paper,
    Typography,
    TextField,
    Grid,
    Button,
    Box
} from "@material-ui/core";

// Icon Imports
import AddIcon from "@material-ui/icons/Add";

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
        const { displayOptions } = this.state;

        return (
            <Box>
                {!displayOptions && (
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <Paper onClick={this.toggleTodoCardOptions}>
                            <Grid item xs={12}>
                                <AddIcon />
                            </Grid>
                        </Paper>
                    </Grid>
                )}
                {displayOptions && (
                    <Grid
                        container
                        direction="column"
                        justify="space-around"
                        alignItems="center"
                    >
                        <Paper>
                            <Grid item xs={12}>
                                <Typography variant="h4">
                                    Enter Card Name
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="todoCardName"
                                    label="Card Name"
                                    onChange={this.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleTodoCardSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.toggleTodoCardOptions}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Box>
        );
    }
}

export default AddTodoCardButton;
