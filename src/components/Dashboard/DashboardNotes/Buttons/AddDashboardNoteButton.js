// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import {
    Popper,
    Paper,
    Box,
    Typography,
    TextareaAutosize,
    Button,
    Grid
} from "@material-ui/core";

// Icon Imports
import NoteOutlinedIcon from "@material-ui/icons/NoteOutlined";

class AddDashboardNotes extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        notesRef: firebase.database().ref("dashboard-notes"),

        // Base
        noteText: "",
        isPopOpen: false,
        anchorElement: null // Point from where the popup is opened
    };

    // Handle popup toggle actions
    handlePopToggle = event => {
        this.setAnchorElement(event);
        this.togglePopup();
    };

    // Handle note saving
    handleNoteSave = () => {
        this.saveToFirebase(this.state);
        this.togglePopup();
    };

    // Open/close popup
    togglePopup = () => {
        this.setState({
            isPopOpen: !this.state.isPopOpen
        });
    };

    // Set anchor element (position where to open the pop)
    setAnchorElement = event => {
        this.setState({ anchorElement: event.currentTarget });
    };

    // Save note in firebase
    saveToFirebase = ({ notesRef, noteText, currentUser }) => {
        notesRef
            .child(currentUser.uid)
            .push()
            .set({ text: noteText })
            .catch(err => console.error(err));
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { isPopOpen, anchorElement } = this.state;

        return (
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<NoteOutlinedIcon />}
                    onClick={this.handlePopToggle}
                >
                    Add Note
                </Button>
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
                                    <Typography variant="h3">
                                        Enter Your Note
                                    </Typography>
                                </Grid>
                                <Grid xs={12} item>
                                    <TextareaAutosize
                                        placeholder="Note text"
                                        name={"noteText"}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid xs={12} item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleNoteSave}
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

export default AddDashboardNotes;
