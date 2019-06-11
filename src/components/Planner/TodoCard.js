import React from "react";
import firebase from "firebase";

import { Grid, Icon, Form } from "semantic-ui-react";

import Todo from "./Todo";

class TodoCard extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            todo: "",
            todoList: [],
            todoRef: firebase.database().ref("todos"),
            currentUser: firebase.auth().currentUser,

            category: this.props.category,
            currentDay: this.props.currentDay,
            monthObjectList: this.props.monthObjectList
        };

        this.fetchTodos = this.fetchTodos.bind(this);
    }
    componentDidMount() {
        this._isMounted = true;
        this.fetchTodos();
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
        this._isMounted = false;
    }

    // Turn off db connections
    removeListeners = () => {
        const { todoRef, currentUser, currentDay } = this.state;

        todoRef.child(`${currentUser.uid}/${currentDay}/`).off();
    };

    // Listen for db changes
    addListeners = () => {
        this.addSetTodoListener(this.state);
        this.addRemoveTodoListener(this.state);
    };

    // Listen for new todo inputs and set to the state so component re-renders
    addSetTodoListener({ currentUser, todoRef, currentDay, category }) {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}`)
            .on("child_added", () => {
                this.fetchTodos();
            });
    }

    // Listen for todo deletions
    addRemoveTodoListener = ({
        todoRef,
        currentUser,
        currentDay,
        category
    }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}`)
            .on("child_removed", () => {
                this.fetchTodos();
            });
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
                        isChecked: false,
                        key: snapshot.key
                    });
                })
                .then(this.clearForm())
                .catch(err => {
                    console.error(err);
                });
        }
    };

    // Fetches todos from firebase
    fetchTodos = () => {
        const { currentUser, todoRef, category, currentDay } = this.state;
        let todoHolder = [];

        todoRef
            .child(`${currentUser.uid}/${currentDay}/${category}`)
            .on("value", snapshot => {
                snapshot.forEach(child => {
                    let key = child.val().key;
                    let value = child.val().value;
                    let isChecked = child.val().isChecked;
                    todoHolder.push({ value, isChecked, key });
                });
            });

        if (this._isMounted) {
            this.setState({ todoList: todoHolder });
        }
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Clear the input form for todo
    clearForm = () => {
        this.setState({ todo: "" });
    };

    // Render todos to the screen
    renderTodos = () => {
        const { todoList, currentDay, category } = this.state;

        return todoList.map(todo => {
            return (
                <Grid.Row key={todo.key}>
                    <Todo
                        fetchTodos={this.fetchTodos}
                        todo={todo}
                        currentDay={currentDay}
                        category={category}
                        isChecked={todo.isChecked}
                        key={todo.key}
                    />
                </Grid.Row>
            );
        });
    };

    render() {
        return (
            <Grid>
                <Grid.Column>
                    {this.renderTodos()}
                    <Grid.Row>
                        <Form.Group widths="equal">
                            <Form.Input
                                name="todo"
                                value={this.state.todo}
                                placeholder="todo"
                                type="float"
                                onChange={this.handleChange}
                                icon={
                                    <Icon
                                        name="add"
                                        onClick={this.handleSubmit}
                                        link
                                    />
                                }
                            />
                        </Form.Group>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

export default TodoCard;
