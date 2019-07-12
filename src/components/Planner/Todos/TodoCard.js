// Object Imports
import React from "react";
import firebase from "firebase";
import moment from "moment";

// Destructured Imports
import { Grid, Icon, Form } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import Todo from "./Todo";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../helpers/Global";

class TodoCard extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        todoText: "",
        todoList: [],
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

        category: this.props.category,
        monthObjectList: this.props.monthObjectList,

        // Redux Props
        currentDay: this.props.currentDay
    };

    static getDerivedStateFromProps(props) {
        return {
            currentDay: props.currentDay
        };
    }

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
            .child(`${currentUser.uid}/${currentDay}/categories/${category}`)
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
            .child(`${currentUser.uid}/${currentDay}/categories/${category}`)
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
        const {
            todoText,
            category,
            currentUser,
            todoRef,
            currentDay
        } = this.state;
        const pushRef = todoRef.child(
            `${currentUser.uid}/${currentDay}/categories/${category}`
        );
        let createdAt = getDayOnlyTimestamp(moment());

        // Pushes to firebase and then updates the fields
        if (todoText) {
            pushRef
                .push()
                .then(todo => {
                    pushRef.child(todo.key).update({
                        text: todoText,
                        isChecked: false,
                        key: todo.key,
                        createdAt,
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
            .child(`${currentUser.uid}/${currentDay}/categories/${category}`)
            .on("value", todo => {
                todo.forEach(todo => {
                    let key = todo.val().key;
                    let text = todo.val().text;
                    let isChecked = todo.val().isChecked;
                    let createdAt = todo.val().createdAt;
                    let isRepeating = todo.val().isRepeating;
                    let repeatingOnWeekDays = todo.val().repeatingOnWeekDays;
                    let repeatingOnMonthDays = todo.val().repeatingOnMonthDays;
                    let repeatAtStartOfMonth = todo.val().repeatAtStartOfMonth;
                    let repeatAtEndOfMonth = todo.val().repeatAtEndOfMonth;
                    let repeatFromDate = todo.val().repeatFromDate;

                    todoHolder.push({
                        text,
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
        this.setState({ todoText: "" });
    };

    // Render todos to the screen
    renderTodos = ({ todoList, category }) =>
        todoList.map(todo => (
            <Grid.Row key={todo.key}>
                <Todo
                    todo={todo}
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
                                name="todoText"
                                value={this.state.todoText}
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

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(
    mapStateToProps,
    null
)(TodoCard);
