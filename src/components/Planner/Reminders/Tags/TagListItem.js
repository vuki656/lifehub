// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Icon, Grid, Checkbox, Popup, Input, Button } from "semantic-ui-react";
import { ChromePicker } from "react-color";

class TagListItem extends React.Component {
    state = {
        reminderTagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser,
        displayColorPicker: false,

        newTagColor: this.props.tag.color,
        newTagText: this.props.tag.text,
        tag: this.props.tag
    };

    static getDerivedStateFromProps(props) {
        return {
            tag: props.tag
        };
    }

    // Remove tag from firebase
    removeTag = () => {
        const { tag, reminderTagsRef, currentUser } = this.state;

        reminderTagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .remove()
            .catch(err => console.err(err));
    };

    // Update tag text in firebase
    handleTagTextUpdate = () => {
        const { newTagText, reminderTagsRef, currentUser, tag } = this.state;

        reminderTagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .update({ text: newTagText })
            .catch(err => console.err(err));
    };

    toggleColorPicker = () => {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        });
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Set the hex color from color picker
    handleTagColorChange = color => {
        this.setState({ newTagColor: color.hex });
    };

    // Save selected color in firebase to corresponding tag
    saveTagColorInFirebase = () => {
        const { newTagColor, reminderTagsRef, currentUser, tag } = this.state;

        reminderTagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .update({ color: newTagColor })
            .catch(err => console.err(err));

        this.toggleColorPicker();
    };

    render() {
        const { tag, displayColorPicker, newTagColor } = this.state;

        return (
            <React.Fragment>
                {displayColorPicker ? (
                    <Button onClick={this.saveTagColorInFirebase}>
                        SaveColor
                    </Button>
                ) : (
                    ""
                )}
                <Grid.Row style={{ backgroundColor: newTagColor }}>
                    {/* prop funct not yet set */}
                    <Checkbox
                        label={tag.text}
                        onChange={() => this.props.handleTagAdd(tag)}
                    />
                    <Icon
                        name={"remove"}
                        link={true}
                        onClick={() => this.removeTag(this.state)}
                    />
                    <Icon
                        name={"paint brush"}
                        link={true}
                        onClick={this.toggleColorPicker}
                    />
                    <Popup
                        trigger={<Icon name={"pencil"} link={true} />}
                        flowing
                        onClose={this.handleTagTextUpdate}
                        on="click"
                    >
                        <Input
                            defaultValue={tag.text}
                            name={"newTagText"}
                            onChange={this.handleChange}
                        />
                    </Popup>
                    {displayColorPicker ? (
                        <ChromePicker
                            color={newTagColor}
                            onChange={this.handleTagColorChange}
                        />
                    ) : (
                        ""
                    )}
                </Grid.Row>
            </React.Fragment>
        );
    }
}

export default TagListItem;
