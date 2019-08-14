// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Popup, Icon, Input, Grid, Button } from "semantic-ui-react";

class EditTodoCardNamePopup extends React.Component {
    state = {
        todoCardRef: firebase.database().ref("todo-cards"),
        currentUser: firebase.auth().currentUser,
        newTodoCardName: "",
        isPopOpen: false,

        // Props
        todoCard: this.props.todoCard
    };

    handleTodoCardNameUpdate = () => {
        this.updateTodoCardname(this.state);
        this.togglePopup();
    };

    // Change todoCard name in firebase
    updateTodoCardname = ({
        todoCardRef,
        currentUser,
        todoCard,
        newTodoCardName
    }) => {
        if (newTodoCardName !== "") {
            todoCardRef
                .child(`${currentUser.uid}/${todoCard.key}`)
                .update({ name: newTodoCardName });
        }
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    togglePopup = () => {
        this.setState({ isPopOpen: !this.state.isPopOpen });
    };

    render() {
        const { todoCard, isPopOpen } = this.state;

        return (
            <Popup
                basic
                trigger={
                    <Icon
                        name={"edit"}
                        link={true}
                        onClick={this.togglePopup}
                        className="todo-card-icon"
                    />
                }
                flowing
                onClose={this.togglePopup}
                open={isPopOpen}
                on="click"
            >
                <Grid className="pad-all-1-rem edit-tag-name-popup">
                    <Grid.Row className="pad-top-bot-0">
                        <span className="subtitle">Enter a New Name</span>
                    </Grid.Row>
                    <Grid.Row className="pad-top-bot-0">
                        <Input
                            className="edit-todo-name-popup-input"
                            defaultValue={todoCard.name}
                            name={"newTodoCardName"}
                            onChange={this.handleChange}
                        />
                    </Grid.Row>
                    <Grid.Row className="pad-top-bot-0">
                        <Button.Group>
                            <Button
                                className="button-primary"
                                onClick={this.handleTodoCardNameUpdate}
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

export default EditTodoCardNamePopup;
