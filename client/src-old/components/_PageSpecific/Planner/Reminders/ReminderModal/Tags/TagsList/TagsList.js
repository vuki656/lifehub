// Object Imports
import React from "react";
import firebase from "../../../../../../../helpers/firebase/Auth";
// Destructured Imports
import { Box } from "@material-ui/core";
import { connect } from "react-redux";
// Component Imports
import TagListItem from "./TagListItem";
// Redux Actions Imports
import { fetchReminderTags, fetchTags } from "../../../../../../../helpers/redux/actions/tagsActions";

class TagsList extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        tagsRef: firebase.database().ref("reminder-tags"),
        remindersRef: firebase.database().ref("reminders"),

        // Props
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
        this._isMounted = true;
        this.activateListeners();
    }

    componentWillUnmount() {
        this.deactivateListeners(this.state);
        this._isMounted = false;
    }

    // Activate database listeners
    activateListeners = () => {
        this.activateRemoveTagListener(this.state);
        this.activateTagListener(this.state);
        this.activateUpdateTagListener(this.state);
    };

    // Deactivate database listeners
    deactivateListeners = () => {
        this.deactivateRemindersListener(this.state);
        this.deactivateTagsListener(this.state);
    };

    // Deactivate reminders ref listener
    deactivateRemindersListener = ({ remindersRef, currentUser }) => {
        remindersRef.child(`${currentUser.uid}`).off();
    };

    // Deactivate tags ref listener
    deactivateTagsListener = ({ tagsRef, currentUser }) => {
        tagsRef.child(`${currentUser.uid}`).off();
    };

    // Listen for new tag adds
    activateTagListener = ({ tagsRef, currentUser }) => {
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
    activateRemoveTagListener = ({ tagsRef, currentUser }) => {
        tagsRef.child(`${currentUser.uid}`).on("child_removed", tagToRemove => {
            this.props.fetchTags(this.state);
            this.props.fetchReminderTags(this.state);
            if (tagToRemove.val()) {
                this.removeTagFromReminders(this.state, tagToRemove);
            }
        });
    };

    // Listen for tag updates
    activateUpdateTagListener = ({ tagsRef, currentUser }) => {
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
                        // Add if there are no tags or if list doesn't contain that tag
                        if (
                            reminder.val().tags === undefined ||
                            !reminder.val().tags.hasOwnProperty(tag)
                        ) {
                            remindersRef
                                .child(
                                    `${currentUser.uid}/${day.key}/${reminder.key}/tags`
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
                            `${currentUser.uid}/${day.key}/${reminder.key}/tags/${tagToRemove.key}`
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
        return <Box>{this.renderTags(this.state)}</Box>;
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    tagList: state.tags.tagList
});

export default connect(mapStateToProps, { fetchTags, fetchReminderTags })(
    TagsList
);
