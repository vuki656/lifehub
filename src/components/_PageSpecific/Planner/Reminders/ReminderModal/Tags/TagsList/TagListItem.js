// Object Imports
import React from "react";
import firebase from "../../../../../../../helpers/firebase/Auth";

// Destructured Imports
import { FormControlLabel, Grid, Checkbox } from "@material-ui/core";
import { connect } from "react-redux";

// Component Imports
import EditTagNamePopup from "./Buttons/EditTagNamePopup";
import EditTagColorPopup from "./Buttons/EditTagColorPopup";

// Icon Imports
import DeleteIcon from "@material-ui/icons/Delete";

// Redux Actions Imports
import { updateTagList } from "../../../../../../../helpers/redux/actions/tagsActions";

class TagListItem extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            // Firebase
            currentUser: firebase.auth().currentUser,
            remindersRef: firebase.database().ref("reminders"),
            tagsRef: firebase.database().ref("reminder-tags"),

            // Base
            displayColorPicker: false,
            isSelected: false,

            // Props
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
        this._isMounted = true;
        this.getTagSelectedState(this.state);
    }

    componentWillUnmount() {
        this._isMounted = false;
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
                            this._isMounted &&
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
            this._isMounted && this.setState({ isSelected: false });
        } else {
            reminderTags[tag.key] = true;
            this.props.updateTagList(reminderTags);
            this._isMounted && this.setState({ isSelected: true });
        }
    };

    // Set the hex color from color picker
    handleTagColorChange = color => {
        this._isMounted && this.setState({ newTagColor: color.hex });
    };

    // Toggle color picker
    toggleColorPicker = () => {
        this._isMounted &&
            this.setState({
                displayColorPicker: !this.state.displayColorPicker
            });
    };

    // Handle popup close
    handlePopClose = () => {
        this._isMounted && this.setState({ newTagColor: this.state.tag.color });
        this.toggleColorPicker();
    };

    render() {
        const { tag, newTagColor, isSelected, displayColorPicker } = this.state;

        return (
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <Grid item xs={8} style={{ backgroundColor: newTagColor }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isSelected}
                                onChange={() =>
                                    this.handleTagCheck(this.state, tag)
                                }
                            />
                        }
                        label={tag.text}
                    />
                </Grid>
                <Grid
                    container
                    item
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                    xs={4}
                >
                    <EditTagNamePopup tag={tag} />
                    <EditTagColorPopup
                        displayColorPicker={displayColorPicker}
                        newTagColor={newTagColor}
                        tag={tag}
                        handleTagColorChange={this.handleTagColorChange}
                        toggleColorPicker={this.toggleColorPicker}
                    />
                    <DeleteIcon
                        name={"remove"}
                        onClick={() => this.removeTag(this.state)}
                    />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    reminderTags: state.tags.reminderTags,
    tagList: state.tags.tagList,
    currentDay: state.planner.currentDay
});

export default connect(mapStateToProps, { updateTagList })(TagListItem);
