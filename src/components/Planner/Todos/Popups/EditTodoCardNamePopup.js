// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Popup, Icon, Input } from "semantic-ui-react";

class EditTodoCardNamePopup extends React.Component {
    state = {
        todoCardRef: firebase.database().ref("todo-cards"),
        currentUser: firebase.auth().currentUser,
        newTodoCardName: "",

        todoCard: this.props.todoCard
    };

    // Change todoCard name in firebase
    handleTodoCardNameUpdate = ({
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

    render() {
        const { todoCard } = this.state;

        return (
            <Popup
                trigger={
                    <Icon
                        name={"pencil"}
                        link={true}
                        className="todo-card-icon"
                    />
                }
                flowing
                onClose={() => this.handleTodoCardNameUpdate(this.state)}
                on="click"
            >
                <Input
                    defaultValue={todoCard.name}
                    name={"newTodoCardName"}
                    onChange={this.handleChange}
                />
            </Popup>
        );
    }
}

export default EditTodoCardNamePopup;
