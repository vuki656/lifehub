import React from "react";
import firebase from "firebase";

import { Checkbox, Icon, Popup, Grid, Input } from "semantic-ui-react";

class Todo extends React.Component {
    state = {
        todo: this.props.todo,
        currentDay: this.props.currentDay,
        category: this.props.category,

        newTodo: "",
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser
    };

    // Send edited todo text to firebase
    updateTodoInFirebase = ({
        todoRef,
        currentDay,
        currentUser,
        category,
        todo,
        newTodo
    }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}/${todo.key}`)
            .update({
                value: newTodo
            });
    };

    // Remove todo in firebase
    removeTodo = ({ currentDay, currentUser, todo, category }) => {
        firebase
            .database()
            .ref(
                `/todos/${currentUser.uid}/${currentDay}/${[category]}/${
                    todo.key
                }`
            )
            .remove()
            .catch(error => console.error(error));
    };

    // Update todo value in firebase after popup cloases
    onClose = () => {
        this.updateTodoInFirebase(this.state);
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { todo } = this.state;
        return (
            <React.Fragment key={todo.key}>
                <Checkbox label={todo.value} checked={todo.checked} />
                <Icon
                    name={"remove"}
                    link={true}
                    onClick={() => this.removeTodo(this.state)}
                />
                <Popup
                    trigger={<Icon name={"pencil"} link={true} />}
                    flowing
                    onClose={this.onClose}
                    on="click"
                >
                    <Grid key={todo.key} centered>
                        <Grid.Column textAlign="center">
                            <Input
                                defaultValue={todo.value}
                                name={"newTodo"}
                                onChange={this.handleChange}
                            />
                        </Grid.Column>
                    </Grid>
                </Popup>
            </React.Fragment>
        );
    }
}

export default Todo;
