// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Icon, Grid, Checkbox, Popup, Input, Button } from "semantic-ui-react";
import { ChromePicker } from "react-color";
import { connect } from "react-redux";

// Redux Actions Imports
import { addTagToList, updateTagList } from "../../../../actions/tagsActions";

class TagListItem extends React.Component {
    state = {
        remindersRef: firebase.database().ref("reminders"),
        reminderTagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser,
        displayColorPicker: false,
        isSelected: false,

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

    componentDidMount() {
        this.getTagSelectedState(this.state);
    }

    // Check if tag from the list is saved in reminder
    getTagSelectedState = ({ selectedTags, tag }) => {
        for (let i = 0; i < selectedTags.length; i++) {
            if (selectedTags[i].key === tag.key) {
                this.setState({ isSelected: true });
                break;
            }
        }
    };

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

    // Save selected color in firebase to corresponding tag
    handleTagColorUpdate = () => {
        const { newTagColor, reminderTagsRef, currentUser, tag } = this.state;

        reminderTagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .update({ color: newTagColor })
            .catch(err => console.err(err));

        this.toggleColorPicker();
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

    // Determine should tag be added or removed
    handleTagCheck = ({ isSelected }, tag) => {
        if (isSelected) {
            let updatedTagList = this.removeTagFromList(this.state, tag);
            this.props.updateTagList(updatedTagList);
            this.setState({ isSelected: false });
        } else {
            this.props.addTagToList(tag);
            this.setState({ isSelected: true });
        }
    };

    // Return tag list without the given tag
    removeTagFromList = ({ selectedTags }, tag) =>
        selectedTags.filter(tagFromList => tagFromList.key !== tag.key);

    render() {
        const { tag, displayColorPicker, newTagColor, isSelected } = this.state;

        return (
            <React.Fragment>
                {displayColorPicker ? (
                    <Button onClick={this.handleTagColorUpdate}>
                        SaveColor
                    </Button>
                ) : (
                    ""
                )}
                <Grid.Row style={{ backgroundColor: newTagColor }}>
                    <Checkbox
                        checked={isSelected}
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
    { addTagToList, updateTagList }
)(TagListItem);
