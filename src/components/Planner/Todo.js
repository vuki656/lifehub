import React from "react";
import firebase from "firebase";

import { Checkbox, Icon, Popup, Input } from "semantic-ui-react";

class Todo extends React.Component {
    state = {
        todo: this.props.todo,
        currentDay: this.props.currentDay,
        category: this.props.category,
        isChecked: this.props.isChecked,

        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser
    };

    // Get parent props -> causes re-render
    static getDerivedStateFromProps(props) {
        return {
            todo: props.todo,
            isChecked: props.todo.isChecked
        };
    }

    // Remove todo in firebase
    removeTodo = ({ currentDay, currentUser, todo, category, todoRef }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}/${todo.key}`)
            .remove()
            .catch(error => console.error(error));
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Send edited todo text to firebase and rerender
    handleTodoTextChange = ({
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
                value: newTodo,
                key: todo.key
            })
            .then(this.props.fetchTodos())
            .catch(error => console.error(error));
    };

    // Send changed todo checkbox state to firebase and rerender
    handleTodoCheckboxChange = ({
        todoRef,
        currentUser,
        currentDay,
        category,
        todo,
        isChecked
    }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}/${todo.key}`)
            .update({ isChecked: !isChecked })
            .then(() => this.props.fetchTodos())
            .catch(error => console.error(error));
    };

    render() {
        const { todo, isChecked } = this.state;
        return (
            <React.Fragment>
                <Checkbox
                    label={todo.value}
                    checked={isChecked}
                    onChange={() => this.handleTodoCheckboxChange(this.state)}
                />
                <Icon
                    name={"remove"}
                    link={true}
                    onClick={() => this.removeTodo(this.state)}
                />
                <Popup
                    trigger={<Icon name={"pencil"} link={true} />}
                    flowing
                    onClose={() => this.handleTodoTextChange(this.state)}
                    on="click"
                >
                    <Input
                        defaultValue={todo.value}
                        name={"newTodo"}
                        onChange={this.handleChange}
                    />
                </Popup>
            </React.Fragment>
        );
    }
}

export default Todo;
