// Object Imports
import React from "react";

// Destructured Imports
import { Popup, Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { SliderPicker } from "react-color";

// Redux Actions Imports
import { setTagColor } from "../../../../../../redux/actions/tagsActions";

class ColorPickerPopup extends React.Component {
    state = {
        // Base
        displayColorPicker: false,

        // Redux Props
        tagColor: this.props.tagColor
    };

    // Opens the color picker
    toggleColorPicker = () => {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        });
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

    render() {
        const { displayColorPicker, tagColor } = this.state;

        return (
            <Popup
                basic
                className="tag-color-picker-popup"
                trigger={
                    <Button
                        className="tag-color-picker-button"
                        onClick={this.toggleColorPicker}
                    >
                        Choose Color <Icon name="paint brush" />
                    </Button>
                }
                open={displayColorPicker}
                on="click"
            >
                <p className="subtitle">Pick Tag Color</p>
                <SliderPicker
                    color={tagColor}
                    onChange={this.handleTagColorChange}
                />
                <Button.Group className="mar-top-1-rem width-100-pcnt">
                    <Button
                        className="button-primary"
                        onClick={() => this.saveTagColor(tagColor)}
                    >
                        Set Color
                    </Button>
                    <Button
                        className="button-secondary"
                        onClick={this.handleColorPickerClose}
                    >
                        Cancel
                    </Button>
                </Button.Group>
            </Popup>
        );
    }
}

const mapStateToProps = state => ({
    tagColor: state.tags.tagColor
});

export default connect(mapStateToProps, { setTagColor })(ColorPickerPopup);
