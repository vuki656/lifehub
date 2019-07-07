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
        selectedTag: null,
        reminderTags: null,
        reminderTagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser
    };

    componentDidMount() {
        this.fetchReminderTags(this.state);
        this.addListeners();
    }

    addListeners = () => {
        this.addRemoveTagListener(this.state);
        this.addTagListener(this.state);
    };

    // Fetch reminder tag list from firebase
    fetchReminderTags = ({ reminderTagsRef, currentUser }) => {
        let tagHolder = [];

        reminderTagsRef.child(currentUser.uid).once("value", tags => {
            if (tags) {
                tags.forEach(tag => {
                    let key = tag.key;
                    let text = tag.val().text;
                    let color = tag.val().color;
                    tagHolder.push({ key, text, color });
                });
                this.setState({ reminderTags: tagHolder });
            }
        });
    };

    // Listen for tag deletions
    addRemoveTagListener = ({ reminderTagsRef, currentUser }) => {
        reminderTagsRef.child(`${currentUser.uid}`).on("child_removed", () => {
            this.fetchReminderTags(this.state);
        });
    };

    // Listen for tag deletions
    addTagListener = ({ reminderTagsRef, currentUser }) => {
        reminderTagsRef.child(`${currentUser.uid}`).on("child_added", () => {
            this.fetchReminderTags(this.state);
        });
    };

    // Render tag list
    renderTags = ({ reminderTags }) => {
        if (reminderTags) {
            return reminderTags.map(tag => (
                <TagListItem tag={tag} key={tag.key} />
            ));
        } else {
            return "No Tags";
        }
    };

    render() {
        const { reminderTags } = this.state;

        return reminderTags ? (
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
