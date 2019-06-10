import React from "react";
import firebase from "firebase";

import { Grid, Button, Form } from "semantic-ui-react";

import Todo from "./Todo";

class TodoCard extends React.Component {
    state = {
        todo: "",
        todoList: [],
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

        category: this.props.category,
        currentDay: this.props.currentDay,
        monthObjectList: this.props.monthObjectList
    };

    componentDidMount() {
        this.fetchTodos();
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    // Turn off db connections
    removeListeners = () => {
        const { todoRef, currentUser, currentDay } = this.state;

        todoRef.child(`${currentUser.uid}/${currentDay}`).off();
    };

    // Listen for db changes
    addListeners = () => {
        this.addTodoListener(this.state);
        this.removeTodoListener(this.state);
    };

    // Listen for new todo inputs and set to the state so component re-renders
    addTodoListener({ currentUser, todoRef, currentDay, category }) {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}`)
            .on("child_added", () => {
                this.fetchTodos();
            });
    }

    // Listen for new todo deletions
    removeTodoListener = ({ todoRef, currentUser, currentDay, category }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}`)
            .on("child_removed", () => {
                this.fetchTodos();
            });
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Send added todo to firebase
    handleSubmit = () => {
        const { todo, category, currentUser, todoRef, currentDay } = this.state;
        let pushRef = todoRef.child(
            `${currentUser.uid}/${currentDay}/${[category]}`
        );

        // Pushes to firebase and then updates the fields
        if (todo) {
            pushRef
                .push()
                .then(snapshot => {
                    pushRef.child(snapshot.key).update({
                        value: todo,
                        checked: false,
                        key: snapshot.key
                    });
                })
                .then(this.clearForm())
                .catch(err => {
                    console.error(err);
                });
        }
    };

    // Clear the input form for todo
    clearForm = () => {
        this.setState({ todo: "" });
    };

    // Fetches todos from firebase
    fetchTodos = () => {
        const { currentUser, todoRef, category, currentDay } = this.state;
        let todoHolder = [];

        todoRef
            .child(`${currentUser.uid}/${currentDay}/${category}`)
            .once("value", snapshot => {
                snapshot.forEach(child => {
                    let key = child.val().key;
                    let value = child.val().value;
                    let checked = child.val().checked;
                    todoHolder.push({ value, checked, key });
                });
            })
            .then(this.setState({ todoList: todoHolder }));
    };

    // Render todos to the screen
    renderTodos = () => {
        const { todoList, currentDay, category } = this.state;

        return todoList.map(todo => {
            return (
                <Grid.Row key={todo.key}>
                    <Todo
                        todo={todo}
                        currentDay={currentDay}
                        category={category}
                    />
                </Grid.Row>
            );
        });
    };

    render() {
        const { todo } = this.state;

        return (
            <Grid>
                <Grid.Column>
                    {/* Render todos when data has been fetched */}
                    {this.renderTodos()}
                    <Grid.Row>
                        <Form.Group widths="equal">
                            <Form.Input
                                name="todo"
                                value={todo}
                                placeholder="todo"
                                type="float"
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Button onClick={this.handleSubmit}>Submit</Button>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

export default TodoCard;
