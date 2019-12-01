// Component Imports
import React from "react";
import firebase from "../../../../../firebase/Auth";

// Destructured Imports
import { SliderPicker } from "react-color";
import { Popup, Button, Icon } from "semantic-ui-react";

class EditTagColorPopup extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        tagsRef: firebase.database().ref("reminder-tags"),

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

    render() {
        const { displayColorPicker, newTagColor } = this.state;

        return (
            <Popup
                basic
                className="tag-color-picker-popup"
                trigger={
                    <Icon
                        name="paint brush"
                        onClick={this.props.toggleColorPicker}
                    />
                }
                open={displayColorPicker}
                on="click"
            >
                <p className="subtitle">Pick Tag Color</p>
                <SliderPicker
                    color={newTagColor}
                    onChange={this.props.handleTagColorChange}
                />
                <Button.Group className="mar-top-1-rem width-100-pcnt">
                    <Button
                        className="button-primary"
                        onClick={this.handleTagColorSave}
                    >
                        Set Color
                    </Button>
                    <Button
                        className="button-secondary"
                        onClick={this.handlePopClose}
                    >
                        Cancel
                    </Button>
                </Button.Group>
            </Popup>
        );
    }
}

export default EditTagColorPopup;
