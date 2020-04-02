// Object Imports
import React from "react";
import firebase from "../../../../../../../helpers/firebase/Auth";
import uuidv4 from "uuid/v4";
// Destructured Imports
import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import { connect } from "react-redux";
// Component Imports
import ColorPickerPopup from "./ColorPickerPopup";

class AddTagSection extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        tagsRef: firebase.database().ref("reminder-tags"),

        // Base
        newTagText: "",
        displayAddTagSection: false,

        // Redux Props
        tagColor: this.props.tagColor
    };

    static getDerivedStateFromProps(props) {
        return {
            tagColor: props.tagColor
        };
    }

    // Save tag in firebase
    saveTag = () => {
        const { tagColor, newTagText, tagsRef, currentUser } = this.state;

        let key = uuidv4();

        tagsRef
            .child(`${currentUser.uid}/${key}`)
            .set({ text: newTagText, color: tagColor, key })
            .catch(err => console.err(err));

        // Close color picker after tag save
        this.setState({ displayColorPicker: false, newTagText: "" });
    };

    // Set new tag text
    handleTagTextAdd = event => {
        this.setState({ newTagText: event.target.value });
    };

    // Display add tag section
    toggleAddTagSection = () => {
        this.setState({
            displayAddTagSection: !this.state.displayAddTagSection
        });
    };

    render() {
        const { newTagText, displayAddTagSection } = this.state;

        return displayAddTagSection ? (
            <Box>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item xs={12}>
                        <Typography variant="h5">Add a New Tag</Typography>
                        <TextField
                            label="Tag Name"
                            value={newTagText}
                            onChange={this.handleTagTextAdd}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ColorPickerPopup />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={this.saveTag}
                            variant="contained"
                            color="primary"
                        >
                            Save Tag
                        </Button>
                        <Button
                            onClick={this.toggleAddTagSection}
                            variant="contained"
                            color="secondary"
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        ) : (
            <Button
                variant="contained"
                color="primary"
                onClick={this.toggleAddTagSection}
            >
                Add Tag
            </Button>
        );
    }
}

const mapStateToProps = state => ({
    tagColor: state.tags.tagColor
});

export default connect(mapStateToProps, null)(AddTagSection);
