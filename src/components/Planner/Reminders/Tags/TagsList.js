// Object Imports
import React from "react";

// Destructured Imports
import { connect } from "react-redux";
import firebase from "../../../../firebase/Auth";

// Component Imports
import TagListItem from "./TagListItem";

// Redux Actions Imports
import { fetchReminderTags } from "../../../../actions/tagsActions";

class TagsList extends React.Component {
    state = {
        selectedTags: null,
        tagList: null,
        reminderTags: null,
        reminderTagsRef: firebase.database().ref("reminder-tags"),
        remindersRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,

        reminder: this.props.reminder,

        // Redux Props
        currentDay: this.props.currentDay
    };

    componentDidMount() {
        // this.props.fetchReminderTags(this.state);
        this.fetchTagList(this.state);
        this.addListeners();
    }

    addListeners = () => {
        this.addRemoveTagListener(this.state);
        this.addTagListener(this.state);
        this.addUpdateTagListener(this.state);
    };

    // Fetch reminder tag list from firebase
    fetchTagList = ({ reminderTagsRef, currentUser }) => {
        let tagHolder = [];

        reminderTagsRef.child(currentUser.uid).once("value", tags => {
            if (tags) {
                tags.forEach(tag => {
                    let key = tag.key;
                    let text = tag.val().text;
                    let color = tag.val().color;
                    tagHolder.push({ key, text, color });
                });
                this.setState({ tagList: tagHolder });
            }
        });
    };

    // Listen for tag deletions
    addRemoveTagListener = ({ reminderTagsRef, currentUser }) => {
        reminderTagsRef.child(`${currentUser.uid}`).on("child_removed", () => {
            this.fetchTagList(this.state);
        });
    };

    // Listen for new tag adds
    addTagListener = ({ reminderTagsRef, currentUser }) => {
        reminderTagsRef.child(`${currentUser.uid}`).on("child_added", () => {
            this.fetchTagList(this.state);
        });
    };

    // Listen for tag updates
    addUpdateTagListener = ({ reminderTagsRef, currentUser }) => {
        reminderTagsRef.child(`${currentUser.uid}`).on("child_changed", () => {
            this.fetchTagList(this.state);
        });
    };

    // Render tag list
    renderTags = ({ tagList }) => {
        if (tagList) {
            return tagList.map(tag => (
                <TagListItem
                    tag={tag}
                    key={tag.key}
                    handleTagAdd={this.props.handleTagAdd}
                />
            ));
        } else {
            return "No Tags";
        }
    };

    render() {
        return <React.Fragment>{this.renderTags(this.state)}</React.Fragment>;
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(
    mapStateToProps,
    { fetchReminderTags }
)(TagsList);
