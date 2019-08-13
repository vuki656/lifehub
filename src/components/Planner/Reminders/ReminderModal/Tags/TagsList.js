// Object Imports
import React from "react";
import firebase from "../../../../../firebase/Auth";

// Destructured Imports
import { connect } from "react-redux";

// Component Imports
import TagListItem from "./TagListItem";

// Redux Actions Imports
import {
    fetchTags,
    fetchReminderTags
} from "../../../../../redux/actions/tagsActions";

class TagsList extends React.Component {
    state = {
        tagsRef: firebase.database().ref("reminder-tags"),
        remindersRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,

        reminder: this.props.reminder,

        // Redux Props
        currentDay: this.props.currentDay,
        tagList: this.props.tagList
    };

    static getDerivedStateFromProps(props) {
        return {
            tagList: props.tagList
        };
    }

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        this.addRemoveTagListener(this.state);
        this.addTagListener(this.state);
        this.addUpdateTagListener(this.state);
    };

    // Listen for new tag adds
    addTagListener = ({ tagsRef, currentUser }) => {
        tagsRef.child(`${currentUser.uid}`).on("child_added", () => {
            this.props.fetchTags(this.state);
            this.props.fetchReminderTags(this.state);
        });

        tagsRef.child(`${currentUser.uid}`).on("value", tags => {
            if (tags.val()) {
                let tagsKeysArr = Object.keys(tags.val());
                this.addTagToReminders(this.state, tagsKeysArr);
            }
        });
    };

    // Listen for tag deletions
    addRemoveTagListener = ({ tagsRef, currentUser }) => {
        tagsRef.child(`${currentUser.uid}`).on("child_removed", tagToRemove => {
            this.props.fetchTags(this.state);
            this.props.fetchReminderTags(this.state);
            if (tagToRemove.val()) {
                this.removeTagFromReminders(this.state, tagToRemove);
            }
        });
    };

    // Listen for tag updates
    addUpdateTagListener = ({ tagsRef, currentUser }) => {
        tagsRef.child(`${currentUser.uid}`).on("child_changed", () => {
            this.props.fetchTags(this.state);
        });
    };

    // Check if reminder tag list contains new tag, if not, add it
    addTagToReminders = ({ remindersRef, currentUser }, tagsKeysArr) => {
        remindersRef.child(currentUser.uid).once("value", days => {
            days.forEach(day => {
                day.forEach(reminder => {
                    tagsKeysArr.forEach(tag => {
                        // Add if there are no tags or if list doesent contain that tag
                        if (
                            reminder.val().tags === undefined ||
                            !reminder.val().tags.hasOwnProperty(tag)
                        ) {
                            remindersRef
                                .child(
                                    `${currentUser.uid}/${day.key}/${
                                        reminder.key
                                    }/tags`
                                )
                                .update({
                                    [tag]: false
                                });
                        }
                    });
                });
            });
        });
    };

    // Remove tag id from all reminders tag list
    removeTagFromReminders = ({ remindersRef, currentUser }, tagToRemove) => {
        remindersRef.child(currentUser.uid).once("value", days => {
            days.forEach(day => {
                day.forEach(reminder => {
                    remindersRef
                        .child(
                            `${currentUser.uid}/${day.key}/${
                                reminder.key
                            }/tags/${tagToRemove.key}`
                        )
                        .remove();
                });
            });
        });
    };

    // Render tag list
    renderTags = ({ tagList, reminder }) =>
        tagList.map(tag => (
            <TagListItem tag={tag} key={tag.key} reminder={reminder} />
        ));

    render() {
        return <div className="tags-list">{this.renderTags(this.state)}</div>;
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    tagList: state.tags.tagList
});

export default connect(
    mapStateToProps,
    { fetchTags, fetchReminderTags }
)(TagsList);
