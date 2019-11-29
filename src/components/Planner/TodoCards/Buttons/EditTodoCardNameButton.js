// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import {
    Box,
    Popper,
    Paper,
    Typography,
    TextField,
    Button,
    Grid
} from "@material-ui/core";

import CreateIcon from "@material-ui/icons/Create";

class EditTodoCardNamePopup extends React.Component {
    state = {
        todoCardRef: firebase.database().ref("todo-cards"),
        currentUser: firebase.auth().currentUser,
        newTodoCardName: "",
        isPopOpen: false,
        anchorElement: null,

        // Props
        todoCard: this.props.todoCard
    };

    static getDerivedStateFromProps(props) {
        return {
            todoCard: props.todoCard
        };
    }

    // Handle popup toggle actions
    handlePopToggle = event => {
        this.setAnchorElement(event);
        this.togglePopup();
    };

    // Set anchor element (position where to open the pop)
    setAnchorElement = event => {
        this.setState({ anchorElement: event.currentTarget });
    };

    // Toggle popup
    togglePopup = () => {
        this.setState({ isPopOpen: !this.state.isPopOpen });
    };

    // Handle updating todo card name
    handleTodoCardNameUpdate = () => {
        this.updateTodoCardname(this.state);
        this.togglePopup();
    };

    // Change todoCard name in firebase
    updateTodoCardname = ({
        todoCardRef,
        currentUser,
        todoCard,
        newTodoCardName
    }) => {
        if (newTodoCardName !== "") {
            todoCardRef
                .child(`${currentUser.uid}/${todoCard.key}`)
                .update({ name: newTodoCardName });
        }
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { todoCard, isPopOpen, anchorElement } = this.state;

        return (
            <Box>
                <CreateIcon onClick={this.handlePopToggle} />
                <Popper
                    open={isPopOpen}
                    anchorEl={anchorElement}
                    placement="right-start"
                    style={{ maxWidth: "350px" }}
                    modifiers={{
                        flip: {
                            enabled: true
                        },
                        preventOverflow: {
                            enabled: true,
                            boundariesElement: "undefined"
                        }
                    }}
                >
                    <Paper>
                        <Box p={2}>
                            <Grid container>
                                <Grid xs={12} item>
                                    <Typography variant="h4">
                                        Enter a New Name
                                    </Typography>
                                </Grid>
                                <Grid xs={12} item>
                                    <TextField
                                        name="newTodoCardName"
                                        defaultValue={todoCard.name}
                                        label="Name"
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid xs={12} item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleTodoCardNameUpdate}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={this.togglePopup}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Popper>
            </Box>
        );
    }
}

export default EditTodoCardNamePopup;
