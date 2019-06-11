import React from "react";
import firebase from "firebase";

import { Grid, Button, Form } from "semantic-ui-react";

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

        this.onPopupClose = this.onPopupClose.bind(this);
        this.updateTodoInFirebase = this.updateTodoInFirebase.bind(this);
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

    // Listen for new todo deletions
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
                    let checked = child.val().checked;
                    todoHolder.push({ value, checked, key });
                });
            });

        if (this._isMounted) {
            this.setState({ todoList: todoHolder });
        }
    };

    // Clear the input form for todo
    clearForm = () => {
        this.setState({ todo: "" });
    };

    // Update todo value in firebase after popup cloases
    onPopupClose = todoState => {
        this.updateTodoInFirebase(todoState);
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
                value: newTodo,
                key: todo.key
            })
            .then(this.fetchTodos())
            .catch(error => console.error(error));
    };

    // Render todos to the screen
    renderTodos = () => {
        const { todoList, currentDay, category } = this.state;

        return todoList.map(todo => {
            return (
                <Grid.Row key={todo.key}>
                    <Todo
                        onPopupClose={this.onPopupClose}
                        updateTodoInFirebase={this.updateTodoInFirebase}
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
