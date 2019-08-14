// Component Imports
import React from "react";
import firebase from "../../../../../firebase/Auth";

// Destructured Imports
import { Grid, Popup, Icon, Input, Button } from "semantic-ui-react";

class EditTagNamePopup extends React.Component {
    state = {
        tagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser,
        isPopOpen: false,
        newTagText: "",

        tag: this.props.tag
    };

    static getDerivedStateFromProps(props) {
        return {
            tag: props.tag
        };
    }

    // Update tag text in firebase
    handleTagTextUpdate = () => {
        const { newTagText, tagsRef, currentUser, tag } = this.state;

        tagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .update({ text: newTagText })
            .catch(err => console.err(err));

        this.togglePopup();
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    togglePopup = () => {
        this.setState({ isPopOpen: !this.state.isPopOpen });
    };

    render() {
        const { isPopOpen, tag } = this.state;

        return (
            <Popup
                className="edit-tag-name-pop"
                basic
                trigger={
                    <Icon
                        name={"edit"}
                        link={true}
                        onClick={this.togglePopup}
                    />
                }
                open={isPopOpen}
                on="click"
            >
                <Grid className="edit-tag-name-grid pad-all-1-rem">
                    <Grid.Row className="pad-top-bot-0">
                        <span className="subtitle">Enter a New Name</span>
                    </Grid.Row>
                    <Grid.Row className="pad-top-bot-0">
                        <Input
                            className="edit-tag-name-input"
                            defaultValue={tag.text}
                            name={"newTagText"}
                            onChange={this.handleChange}
                        />
                    </Grid.Row>
                    <Grid.Row className="pad-top-bot-0">
                        <Button.Group className="width-100-pcnt">
                            <Button
                                className="button-primary"
                                onClick={this.handleTagTextUpdate}
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
        );
    }
}

export default EditTagNamePopup;
