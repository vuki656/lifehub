// Object Imports
import React from "react";
import firebase from "../../../../../firebase/Auth";

// Destructured Imports
import { connect } from "react-redux";

// Component Imports
import TagListItem from "./TagListItem";

// Redux Actions Imports
import { fetchTags } from "../../../../../redux/actions/tagsActions";

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

    // Listen for tag deletions
    addRemoveTagListener = ({ tagsRef, currentUser }) => {
        tagsRef.child(`${currentUser.uid}`).on("child_removed", () => {
            this.props.fetchTags(this.state);
        });
    };

    // Listen for new tag adds
    addTagListener = ({ tagsRef, currentUser }) => {
        tagsRef.child(`${currentUser.uid}`).on("child_added", () => {
            this.props.fetchTags(this.state);
        });
    };

    // Listen for tag updates
    addUpdateTagListener = ({ tagsRef, currentUser }) => {
        tagsRef.child(`${currentUser.uid}`).on("child_changed", () => {
            this.props.fetchTags(this.state);
        });
    };

    // Render tag list
    renderTags = ({ tagList, reminder }) =>
        tagList.map(tag => (
            <TagListItem tag={tag} key={tag.key} reminder={reminder} />
        ));

    render() {
        return <React.Fragment>{this.renderTags(this.state)}</React.Fragment>;
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    tagList: state.tags.tagList
});

export default connect(
    mapStateToProps,
    { fetchTags }
)(TagsList);
