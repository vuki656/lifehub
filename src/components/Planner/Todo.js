import React from "react";
import firebase from "firebase";

import { Grid, Checkbox, Icon } from "semantic-ui-react";

class Todo extends React.Component {
    state = {
        todo: this.props.todo,
        currentDay: this.props.currentDay,
        category: this.props.category,

        dbRef: firebase.database().ref(),
        currentUser: firebase.auth().currentUser
    };

    removeTodo = () => {
        const { currentDay, currentUser, todo, category } = this.state;
        let key = todo.key;

        firebase
            .database()
            .ref(`/todos/${currentUser.uid}/${currentDay}/${[category]}/${key}`)
            .remove()
            .catch(error => console.error(error));
    };

    render() {
        const { todo } = this.state;
        return (
            <React.Fragment>
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
