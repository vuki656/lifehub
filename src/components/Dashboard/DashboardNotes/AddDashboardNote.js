// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { TextArea, Popup, Grid, Button, Icon } from "semantic-ui-react";

class AddDashboardNotes extends React.Component {
    state = {
        notesRef: firebase.database().ref("dashboard-notes"),
        currentUser: firebase.auth().currentUser,
        noteText: "",
        isPopOpen: false
    };

    togglePopup = () => {
        this.setState({ isPopOpen: !this.state.isPopOpen });
    };

    handleNoteSave = () => {
        this.saveToFirebase(this.state);
        this.togglePopup();
    };

    // Save note in firebase
    saveToFirebase = ({ notesRef, noteText, currentUser }) => {
        notesRef
            .child(currentUser.uid)
            .push()
            .set({ text: noteText })
            .catch(err => console.error(err));
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { isPopOpen } = this.state;

        return (
            <React.Fragment>
                <Popup
                    className="edit-todo-name-popup"
                    basic
                    trigger={
                        <React.Fragment>
                            <span className="title">Enter Your Note </span>
                            <Icon
                                className="add-dashboard-note-icon"
                                name={"add"}
                                link={true}
                                onClick={this.togglePopup}
                            />
                        </React.Fragment>
                    }
                    flowing
                    onClose={this.togglePopup}
                    open={isPopOpen}
                    on="click"
                >
                    <Grid className="add-dashboard-note-pop pad-all-1-rem">
                        <Grid.Row className="pad-top-bot-0">
                            <span className="subtitle">Note Text</span>
                        </Grid.Row>
                        <Grid.Row className="pad-top-bot-0">
                            <TextArea
                                className="add-dashboard-note-textarea"
                                rows={6}
                                name={"noteText"}
                                onChange={this.handleChange}
                            />
                        </Grid.Row>
                        <Grid.Row>
                            <Button.Group>
                                <Button
                                    className="button-primary"
                                    onClick={this.handleNoteSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    className="button-secondary"
                                    onClick={this.togglePopup}
                                >
                                    Cancel
                                </Button>
                            </Button.Group>
                        </Grid.Row>
                    </Grid>
                </Popup>
            </React.Fragment>
        );
    }
}

export default AddDashboardNotes;
