import React from "react";
import firebase from "firebase";

import { Checkbox, Icon, Popup, Grid, Input } from "semantic-ui-react";

class Todo extends React.Component {
    state = {
        todo: this.props.todo,
        currentDay: this.props.currentDay,
        category: this.props.category,
        isChecked: this.props.isChecked,

        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser
    };

    // Update todo with new text value
    static getDerivedStateFromProps(props) {
        return {
            todo: props.todo
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

    handleCheckboxChange = ({
        todoRef,
        currentUser,
        currentDay,
        category,
        todo,
        isChecked
    }) => {
        this.setState({ isChecked: !isChecked });
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}/${todo.key}`)
            .update({ isChecked: !isChecked });
    };

    render() {
        const { todo, isChecked } = this.state;
        return (
            <React.Fragment key={todo.key}>
                <Checkbox
                    label={todo.value}
                    checked={isChecked}
                    onChange={() => this.handleCheckboxChange(this.state)}
                />
                <Icon
                    name={"remove"}
                    link={true}
                    onClick={() => this.removeTodo(this.state)}
                />
                <Popup
                    trigger={<Icon name={"pencil"} link={true} />}
                    flowing
                    onClose={() => this.props.onPopupClose(this.state)}
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
