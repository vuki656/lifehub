// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Grid } from "semantic-ui-react";

// Component Imports
import TagListItem from "./TagListItem";
import AddTagSection from "./AddTagSection";

class TagOptions extends React.Component {
    state = {
        selectedTags: null,
        tagList: null,
        reminderTags: null,
        reminderTagsRef: firebase.database().ref("reminder-tags"),
        remindersRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,

        currentDay: this.props.currentDay
    };

    componentDidMount() {
        this.fetchReminderTags(this.state);
        this.fetchTags(this.state);
        this.addListeners();
    }

    addListeners = () => {
        this.addRemoveTagListener(this.state);
        this.addTagListener(this.state);
        this.addUpdateTagListener(this.state);
    };

    fetchReminderTags = ({ remindersRef, currentUser, currentDay }) => {
        // let reminderTagHolder = [];
        // remindersRef.child(`${currentUser.uid}/${currentDay}/`).once("value", reminderTags => {
        //     if (reminderTags) {
        //         reminderTags.forEach(tag => {
        //             let key = tag.key;
        //             let text = tag.val().text;
        //             let color = tag.val().color;
        //             reminderTagHolder.push({ key, text, color });
        //         });
        //         this.setState({ reminderTags: reminderTagHolder });
        //     }
        // });
    };

    // Fetch reminder tag list from firebase
    fetchTags = ({ reminderTagsRef, currentUser }) => {
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
            this.fetchTags(this.state);
        });
    };

    // Listen for new tag adds
    addTagListener = ({ reminderTagsRef, currentUser }) => {
        reminderTagsRef.child(`${currentUser.uid}`).on("child_added", () => {
            this.fetchTags(this.state);
        });
    };

    // Listen for tag updates
    addUpdateTagListener = ({ reminderTagsRef, currentUser }) => {
        reminderTagsRef.child(`${currentUser.uid}`).on("child_changed", () => {
            this.fetchTags(this.state);
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

    // Add selected tag to tagList
    // THIS WIL HAVE TO GO GLOBAL WITH REDUX
    // handleTagAdd = (checkedTag, event, data) => {
    //     const { selectedTags } = this.state;
    //     let newTagList = [];

    //     if (selectedTags) {
    //         newTagList = selectedTagList.filter(
    //             selectedTagFromList => selectedTagFromList !== checkedTag
    //         );
    //     } else {
    //         this.pushTagToFirebase(checkedTag);
    //     }
    // };

    render() {
        const { tagList } = this.state;

        return tagList ? (
            <Grid>
                <Grid.Row columns={"equal"}>
                    <Grid.Column>{this.renderTags(this.state)}</Grid.Column>
                    <Grid.Column>
                        <AddTagSection />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        ) : (
            "Loading..."
        );
    }
}

export default TagOptions;
