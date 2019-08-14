// Object Imports
import React from "react";
import firebase from "../../../../../firebase/Auth";

// Destructured Imports
import { Icon, Grid, Checkbox } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import EditTagNamePopup from "./EditTagNamePopup";
import EditTagColorPopup from "./EditTagColorPopup";

// Redux Actions Imports
import { updateTagList } from "../../../../../redux/actions/tagsActions";

class TagListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

        this.toggleColorPicker = this.toggleColorPicker.bind(this);
        this.handleTagColorChange = this.handleTagColorChange.bind(this);
    }

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

    // Set the hex color from color picker
    handleTagColorChange = color => {
        this.setState({ newTagColor: color.hex });
    };

    toggleColorPicker = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handlePopClose = () => {
        this.setState({ newTagColor: this.state.tag.color });
        this.toggleColorPicker();
    };

    render() {
        const { tag, newTagColor, isSelected, displayColorPicker } = this.state;

        return (
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
                            <EditTagNamePopup tag={tag} />
                            <EditTagColorPopup
                                displayColorPicker={displayColorPicker}
                                newTagColor={newTagColor}
                                tag={tag}
                                handleTagColorChange={this.handleTagColorChange}
                                toggleColorPicker={this.toggleColorPicker}
                            />

                            <Icon
                                name={"remove"}
                                link={true}
                                onClick={() => this.removeTag(this.state)}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Grid.Row>
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
