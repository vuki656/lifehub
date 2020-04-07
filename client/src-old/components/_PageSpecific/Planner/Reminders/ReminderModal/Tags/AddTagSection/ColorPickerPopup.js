// Object Imports
import React from "react";
// Destructured Imports
import { Box, Button, Paper, Popper, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { SliderPicker } from "react-color";
// Icon Imports
import BrushIcon from "@material-ui/icons/Brush";
// Redux Actions Imports
import { setTagColor } from "../../../../../../../helpers/redux/actions/tagsActions";

class ColorPickerPopup extends React.Component {
    state = {
        // Base
        displayColorPicker: false,
        anchorElement: null, // Point from where the popup is opened

        // Redux Props
        tagColor: this.props.tagColor
    };

    // Opens the color picker
    toggleColorPicker = event => {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        });
        event && this.setAnchorElement(event);
    };

    // Set the hex color from color picker
    handleTagColorChange = color => {
        this.setState({ tagColor: color.hex });
    };

    // Set tag color on global redux state
    saveTagColor = tagColor => {
        this.setState({ displayColorPicker: false });
        this.props.setTagColor(tagColor);
    };

    // Close color picker pop and reset default tag color
    handleColorPickerClose = () => {
        this.toggleColorPicker();
        this.setState({ tagColor: this.props.color });
    };

    // Set anchor element (position where to open the pop)
    setAnchorElement = event => {
        this.setState({ anchorElement: event.currentTarget });
    };

    render() {
        const { displayColorPicker, tagColor, anchorElement } = this.state;

        return (
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.toggleColorPicker}
                    endIcon={<BrushIcon />}
                >
                    Choose Color
                </Button>
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
                        <Typography variant="h5">Pick Tag Color</Typography>
                        <SliderPicker
                            color={tagColor}
                            onChange={this.handleTagColorChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.saveTagColor(tagColor)}
                        >
                            Set Color
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={this.handleColorPickerClose}
                        >
                            Cancel
                        </Button>
                    </Popper>
                </Paper>
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    tagColor: state.tags.tagColor
});

export default connect(mapStateToProps, { setTagColor })(ColorPickerPopup);
