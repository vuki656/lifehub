// Component Imports
import React from "react";
import firebase from "../../../../../../../../helpers/firebase/Auth";

// Destructured Imports
import {
    Grid,
    Box,
    Paper,
    Button,
    Popper,
    Typography,
    TextField
} from "@material-ui/core";

// Icon Imports
import EditIcon from "@material-ui/icons/Edit";

class EditTagNamePopup extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        tagsRef: firebase.database().ref("reminder-tags"),

        // Base
        isPopOpen: false,
        newTagText: "",
        anchorElement: null, // Point from where the popup is opened

        // Props
        tag: this.props.tag
    };

    static getDerivedStateFromProps(props) {
        return {
            tag: props.tag
        };
    }

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

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

    // Update tag text in firebase
    handleTagTextUpdate = () => {
        this.saveToFirebase();
        this.togglePopup();
    };

    // Update tag text in firebase
    saveToFirebase = () => {
        const { newTagText, tagsRef, currentUser, tag } = this.state;

        tagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .update({ text: newTagText })
            .catch(err => console.err(err));
    };

    render() {
        const { isPopOpen, tag, anchorElement } = this.state;

        return (
            <Box>
                <EditIcon onClick={this.handlePopToggle} />
                <Popper
                    open={isPopOpen}
                    anchorEl={anchorElement}
                    placement="right-start"
                    style={{ maxWidth: "350px", zIndex: "1301" }}
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
                                        Enter a New Name
                                    </Typography>
                                </Grid>
                                <Grid xs={12} item>
                                    <TextField
                                        name="newTagText"
                                        label="Reminder Title"
                                        onChange={this.handleChange}
                                        defaultValue={tag.text}
                                    />
                                </Grid>
                                <Grid xs={12} item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleTagTextUpdate}
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

export default EditTagNamePopup;
