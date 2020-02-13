// Component Imports
import React from "react";
import firebase from "../../../../../../../../helpers/firebase/Auth";

// Destructured Imports
import { SliderPicker } from "react-color";
import { Button, Typography, Popper, Box, Paper } from "@material-ui/core";

// Icon Imports
import BrushIcon from "@material-ui/icons/Brush";

class EditTagColorPopup extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        tagsRef: firebase.database().ref("reminder-tags"),

        // Base
        anchorElement: null, // Point from where the popup is opened

        // Props
        displayColorPicker: this.props.displayColorPicker,
        newTagColor: this.props.tag.color,
        tag: this.props.tag
    };

    static getDerivedStateFromProps(props) {
        return {
            displayColorPicker: props.displayColorPicker,
            newTagColor: props.newTagColor
        };
    }

    // Handle popup open
    handlePopOpen = event => {
        this.props.toggleColorPicker();
        event && this.setAnchorElement(event);
    };

    // Handle change color save
    handleTagColorSave = () => {
        this.saveTagColor(this.state);
        this.props.toggleColorPicker();
    };

    // Save selected color in firebase to corresponding tag
    saveTagColor = () => {
        const { newTagColor, tagsRef, currentUser, tag } = this.state;

        tagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .update({ color: newTagColor })
            .catch(err => console.err(err));
    };

    // Set anchor element (position where to open the pop)
    setAnchorElement = event => {
        this.setState({ anchorElement: event.currentTarget });
    };

    render() {
        const { displayColorPicker, newTagColor, anchorElement } = this.state;

        return (
            <Box>
                <BrushIcon onClick={this.handlePopOpen} />
                <Paper>
                    <Popper
                        open={displayColorPicker}
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
                        <Typography variant="h5">Change Tag Color</Typography>
                        <SliderPicker
                            color={newTagColor}
                            onChange={this.handleTagColorChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleTagColorSave}
                        >
                            Set Color
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={this.handlePopClose}
                        >
                            Cancel
                        </Button>
                    </Popper>
                </Paper>
            </Box>
        );
    }
}

export default EditTagColorPopup;
