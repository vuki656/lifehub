// Object Imports
import React from "react";
import firebase from "../../../../../firebase/Auth";

// Destructured Imports
import { Icon, Grid, Checkbox, Popup, Input, Button } from "semantic-ui-react";
import { ChromePicker } from "react-color";
import { connect } from "react-redux";

// Redux Actions Imports
import { updateTagList } from "../../../../../redux/actions/tagsActions";

class TagListItem extends React.Component {
    state = {
        remindersRef: firebase.database().ref("reminders"),
        tagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser,
        displayColorPicker: false,
        isSelected: false,

        reminder: this.props.reminder,
        newTagColor: this.props.tag.color,
        newTagText: this.props.tag.text,
        tag: this.props.tag,

        // Redux Props
        reminderTags: this.props.reminderTags,
        tagList: this.props.tagList,
        currentDay: this.props.currentDay
    };

    static getDerivedStateFromProps(props) {
        return {
            reminder: props.reminder,
            tag: props.tag,
            reminderTags: props.reminderTags,
            tagList: props.tagList
        };
    }

    componentDidMount() {
        this.getTagSelectedState(this.state);
    }

    // Check if tag from the list is saved in reminder
    getTagSelectedState = ({
        remindersRef,
        currentUser,
        currentDay,
        reminder,
        tag
    }) => {
        if (reminder) {
            remindersRef
                .child(`${currentUser.uid}/${currentDay}/${reminder.key}/tags`)
                .once("value", reminderTags => {
                    reminderTags.forEach(reminderTag => {
                        if (
                            reminderTag.val() === true &&
                            tag.key === reminderTag.key
                        ) {
                            this.setState({ isSelected: true });
                        }
                    });
                });
        }
    };

    // Remove tag from firebase
    removeTag = () => {
        const { tag, tagsRef, currentUser } = this.state;

        tagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .remove()
            .catch(err => console.err(err));
    };

    // Update tag text in firebase
    handleTagTextUpdate = () => {
        const { newTagText, tagsRef, currentUser, tag } = this.state;

        tagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .update({ text: newTagText })
            .catch(err => console.err(err));
    };

    // Save selected color in firebase to corresponding tag
    handleTagColorUpdate = () => {
        const { newTagColor, tagsRef, currentUser, tag } = this.state;

        tagsRef
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
    handleTagCheck = ({ isSelected, reminderTags }, tag) => {
        if (isSelected) {
            reminderTags[tag.key] = false;
            this.props.updateTagList(reminderTags);
            this.setState({ isSelected: false });
        } else {
            reminderTags[tag.key] = true;
            this.props.updateTagList(reminderTags);
            this.setState({ isSelected: true });
        }
    };

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
                <Grid.Row>
                    <Grid className="pad-lef-rig-1-rem">
                        <Grid.Row
                            className="tag-list-item"
                            style={{ backgroundColor: newTagColor }}
                        >
                            <Grid.Column className="padd-all-0" width={10}>
                                <Checkbox
                                    checked={isSelected}
                                    label={tag.text}
                                    onChange={() =>
                                        this.handleTagCheck(this.state, tag)
                                    }
                                />
                            </Grid.Column>
                            <Grid.Column
                                className="padd-all-0 tag-list-item-icons"
                                width={6}
                                floated="right"
                            >
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
                                    trigger={
                                        <Icon name={"pencil"} link={true} />
                                    }
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
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

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
    reminderTags: state.tags.reminderTags,
    tagList: state.tags.tagList,
    currentDay: state.planner.currentDay
});

export default connect(
    mapStateToProps,
    { updateTagList }
)(TagListItem);
