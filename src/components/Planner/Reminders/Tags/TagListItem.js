// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Icon, Grid, Checkbox } from "semantic-ui-react";
import { ChromePicker } from "react-color";

class TagListItem extends React.Component {
    state = {
        reminderTagsRef: firebase.database().ref("reminder-tags"),
        currentUser: firebase.auth().currentUser,
        displayColorPicker: false,

        tag: this.props.tag
    };

    static getDerivedStateFromProps(props) {
        return {
            tag: props.tag
        };
    }

    // Remove tag from firebase
    removeTag = () => {
        const { tag, reminderTagsRef, currentUser } = this.state;

        reminderTagsRef
            .child(`${currentUser.uid}/${tag.key}`)
            .remove()
            .catch(err => console.err(err));
    };

    openColorPicker = () => {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        });
    };

    render() {
        const { tag, displayColorPicker } = this.state;

        return (
            <Grid.Row style={{ backgroundColor: tag.color }}>
                <Checkbox label={tag.text} />
                <Icon
                    name={"remove"}
                    link={true}
                    onClick={() => this.removeTag(this.state)}
                />
                <Icon
                    name={"paint brush"}
                    link={true}
                    onClick={this.openColorPicker}
                />
                {displayColorPicker ? (
                    <ChromePicker
                        color={tag.color}
                        onChange={this.handleTagColorChange}
                    />
                ) : (
                    ""
                )}
            </Grid.Row>
        );
    }
}

export default TagListItem;
