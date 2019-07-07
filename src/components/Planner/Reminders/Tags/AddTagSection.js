// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Icon, Grid, Segment, Input, Button } from "semantic-ui-react";
import { ChromePicker } from "react-color";

class AddTagSection extends React.Component {
    state = {
        newTagText: "",
        tagColor: "#2185d0",
        displayColorPicker: false,
        reminderTagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser
    };

    // Opens the color picker trough bool
    openColorPicker = event => {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        });
    };

    // Save tag in firebase
    saveTag = () => {
        const {
            tagColor,
            newTagText,
            reminderTagsRef,
            currentUser
        } = this.state;

        reminderTagsRef
            .child(`${currentUser.uid}`)
            .push()
            .set({ text: newTagText, color: tagColor })
            .catch(err => console.err(err));

        // Close color picker after tag save
        this.setState({ displayColorPicker: false });
    };

    // Set new tag text
    handleTagTextAdd = event => {
        this.setState({ newTagText: event.target.value });
    };

    // Set the hex color from color picker
    handleTagColorChange = color => {
        this.setState({ tagColor: color.hex });
    };

    render() {
        const { displayColorPicker, tagColor } = this.state;

        return (
            <Segment>
                <Grid.Row>
                    Add a New Tag
                    <Input
                        placeholder="Tag Text"
                        onChange={this.handleTagTextAdd}
                        onClick={this.onInputClick}
                    />
                </Grid.Row>
                <Grid.Row>
                    Set Tag Color
                    <Icon name="paint brush" onClick={this.openColorPicker} />
                    {displayColorPicker ? (
                        <ChromePicker
                            color={tagColor}
                            onChange={this.handleTagColorChange}
                        />
                    ) : (
                        ""
                    )}
                </Grid.Row>
                <Grid.Row>
                    <Button onClick={this.saveTag}>Save Tag</Button>
                </Grid.Row>
            </Segment>
        );
    }
}

export default AddTagSection;
