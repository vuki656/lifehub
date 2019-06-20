import React from "react";
import firebase from "firebase";
import moment from "moment";

import { Grid, Icon, Form } from "semantic-ui-react";

import { getDayOnlyTimestamp } from "../../../helpers/Global";

import Todo from "./Todo";

class TodoCard extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

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
        this._isMounted = true;
        this.fetchTodos(this.state);
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners(this.state);
        this._isMounted = false;
    }

    // Turn off db connections
    removeListeners = ({ todoRef, currentUser, currentDay }) => {
        todoRef.child(`${currentUser.uid}/${currentDay}/`).off();
    };

    // Listen for db changes
    addListeners = () => {
        this.addSetTodoListener(this.state);
        this.addRemoveTodoListener(this.state);
        this.addChangeTodoListener(this.state);
    };

    // Listen for new todo inputs and set to the state so component re-renders
    addSetTodoListener({ currentUser, todoRef, currentDay, category }) {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${category}`)
            .on("child_added", () => {
                this.fetchTodos(this.state);
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
            .child(`${currentUser.uid}/${currentDay}/${category}`)
            .on("child_removed", () => {
                this.fetchTodos(this.state);
            });
    };

    // Listen for reminder deletions
    addChangeTodoListener = ({ todoRef, currentUser, currentDay }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}`)
            .on("child_changed", () => {
                this.fetchTodos(this.state);
            });
    };

    // Send added todo to firebase
    handleSubmit = () => {
        const { todo, category, currentUser, todoRef, currentDay } = this.state;
        const pushRef = todoRef.child(
            `${currentUser.uid}/${currentDay}/${category}`
        );
        let createdAt = getDayOnlyTimestamp(moment());

        // Pushes to firebase and then updates the fields
        if (todo) {
            pushRef
                .push()
                .then(snapshot => {
                    pushRef.child(snapshot.key).update({
                        value: todo,
                        isChecked: false,
                        key: snapshot.key,
                        createdAt: createdAt,
                        isRepeating: false,
                        repeatingOnWeekDays: "",
                        repeatingOnMonthDays: "",
                        repeatAtEndOfMonth: false,
                        repeatAtStartOfMonth: false,
                        repeatFromDate: false
                    });
                })
                .then(this.clearForm())
                .catch(err => {
                    console.error(err);
                });
        }
    };

    // Fetches todos from firebase
    fetchTodos = ({ currentUser, todoRef, category, currentDay }) => {
        let todoHolder = [];

        todoRef
            .child(`${currentUser.uid}/${currentDay}/${category}`)
            .on("value", snapshot => {
                snapshot.forEach(child => {
                    let key = child.val().key;
                    let value = child.val().value;
                    let isChecked = child.val().isChecked;
                    let createdAt = child.val().createdAt;
                    let isRepeating = child.val().isRepeating;
                    let repeatingOnWeekDays = child.val().repeatingOnWeekDays;
                    let repeatingOnMonthDays = child.val().repeatingOnMonthDays;
                    let repeatAtStartOfMonth = child.val().repeatAtStartOfMonth;
                    let repeatAtEndOfMonth = child.val().repeatAtEndOfMonth;
                    let repeatFromDate = child.val().repeatFromDate;

                    todoHolder.push({
                        value,
                        isChecked,
                        key,
                        createdAt,
                        isRepeating,
                        repeatingOnWeekDays,
                        repeatingOnMonthDays,
                        repeatAtStartOfMonth,
                        repeatAtEndOfMonth,
                        repeatFromDate
                    });
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
    renderTodos = ({ todoList, currentDay, category }) =>
        todoList.map(todo => (
            <Grid.Row key={todo.key}>
                <Todo
                    todo={todo}
                    currentDay={currentDay}
                    category={category}
                    isChecked={todo.isChecked}
                    key={todo.key}
                />
            </Grid.Row>
        ));

    render() {
        return (
            <Grid>
                <Grid.Column>
                    {this.renderTodos(this.state)}
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
