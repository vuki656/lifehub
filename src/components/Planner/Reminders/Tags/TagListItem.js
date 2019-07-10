// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { Icon, Grid, Checkbox, Popup, Input, Button } from "semantic-ui-react";
import { ChromePicker } from "react-color";
import { connect } from "react-redux";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../../helpers/Global";

// Redux Actions Imports
import {
    addTagToList,
    removeTagFromList
} from "../../../../actions/tagsActions";

class TagListItem extends React.Component {
    state = {
        remindersRef: firebase.database().ref("reminders"),
        reminderTagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser,
        displayColorPicker: false,

        reminder: this.props.reminder,
        newTagColor: this.props.tag.color,
        newTagText: this.props.tag.text,
        tag: this.props.tag,

        // Redux Props
        selectedTags: this.props.selectedTags
    };

    static getDerivedStateFromProps(props) {
        return {
            reminder: props.reminder,
            tag: props.tag,
            selectedTags: props.selectedTags
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

    // Open/close color picker
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

    // Determine should tag be added or removed
    handleTagCheck = ({ selectedTags }, tag) => {
        if (selectedTags.includes(tag)) {
            this.handleTagRemoval(tag);
        } else {
            this.handleTagAdd(tag);
        }
    };

    // Add tag to redux and firebase
    handleTagAdd = tag => {
        this.props.addTagToList(tag);
        this.setTagInFirebase(this.state, tag);
    };

    // Remove tag from redux and firebase
    handleTagRemoval = tag => {
        this.props.removeTagFromList(tag);
        this.setTagInFirebase(this.state, tag, tag.text, tag.color);
    };

    // Set tag in its reminder
    // When removing use empty text and color so its removed
    // When adding, use passed args so its added
    setTagInFirebase = (
        { remindersRef, currentUser, reminder },
        tag,
        tagText = null,
        tagColor = null
    ) => {
        for (
            let itterationDate = moment(reminder.startDate);
            itterationDate.isBefore(moment(reminder.endDate).add(1, "day"));
            itterationDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(itterationDate);

            remindersRef
                .child(
                    `${currentUser.uid}/${dayTimestamp}/${reminder.key}/tags`
                )
                .update({
                    [tag.key]: {
                        text: tagText,
                        color: tagColor
                    }
                })
                .catch(err => console.err(err));
        }
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
                    <Checkbox
                        label={tag.text}
                        onChange={() => this.handleTagCheck(this.state, tag)}
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

const mapStateToProps = state => ({
    selectedTags: state.tags.reminderTagList
});

export default connect(
    mapStateToProps,
    { addTagToList, removeTagFromList }
)(TagListItem);
