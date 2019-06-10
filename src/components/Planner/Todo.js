import React from "react";
import firebase from "firebase";

import { Checkbox, Icon } from "semantic-ui-react";

class Todo extends React.Component {
    state = {
        todo: this.props.todo,
        currentDay: this.props.currentDay,
        category: this.props.category,

        currentUser: firebase.auth().currentUser
    };

    removeTodo = () => {
        const { currentDay, currentUser, todo, category } = this.state;

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

    render() {
        const { todo } = this.state;
        return (
            <React.Fragment key={todo.key}>
                <Checkbox label={todo.value} checked={todo.checked} />
                <Icon
                    name={"remove"}
                    link={true}
                    onClick={() => this.removeTodo()}
                />
            </React.Fragment>
        );
    }
}

export default Todo;
