// Object Imports
import React from "react";
import firebase from "../../../../../../firebase/Auth";
import uuidv4 from "uuid/v4";

// Destructured Imports
import { Grid, Segment, Input, Button } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import ColorPickerPopup from "./ColorPickerPopup";

class AddTagSection extends React.Component {
    state = {
        tagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser,
        newTagText: "",
        displayAddTagSection: false,

        // Redux Props
        tagColor: this.props.tagColor
    };

    static getDerivedStateFromProps(props) {
        return {
            tagColor: props.tagColor
        };
    }

    // Save tag in firebase
    saveTag = () => {
        const { tagColor, newTagText, tagsRef, currentUser } = this.state;

        let key = uuidv4();

        tagsRef
            .child(`${currentUser.uid}/${key}`)
            .set({ text: newTagText, color: tagColor, key })
            .catch(err => console.err(err));

        // Close color picker after tag save
        this.setState({ displayColorPicker: false, newTagText: "" });
    };

    // Set new tag text
    handleTagTextAdd = event => {
        this.setState({ newTagText: event.target.value });
    };

    // Display add tag section
    toggleAddTagSection = () => {
        this.setState({
            displayAddTagSection: !this.state.displayAddTagSection
        });
    };

    render() {
        const { newTagText, displayAddTagSection } = this.state;

        return displayAddTagSection ? (
            <Segment className="add-tag-section">
                <Grid.Row>
                    <p className="subtitle">Add a New Tag</p>
                    <Input
                        className="add-tag-input"
                        placeholder="Tag Text"
                        value={newTagText}
                        onChange={this.handleTagTextAdd}
                        onClick={this.onInputClick}
                    />
                </Grid.Row>
                <Grid.Row>
                    <ColorPickerPopup />
                </Grid.Row>
                <Grid.Row>
                    <Button.Group className="width-100-pcnt">
                        <Button
                            onClick={this.saveTag}
                            className="button-primary"
                        >
                            Save Tag
                        </Button>
                        <Button
                            onClick={this.toggleAddTagSection}
                            className="button-secondary"
                        >
                            Close
                        </Button>
                    </Button.Group>
                </Grid.Row>
            </Segment>
        ) : (
            <Button
                className="button-secondary mar-top-1-rem"
                onClick={this.toggleAddTagSection}
            >
                Add Tag
            </Button>
        );
    }
}

const mapStateToProps = state => ({
    tagColor: state.tags.tagColor
});

export default connect(
    mapStateToProps,
    null
)(AddTagSection);
